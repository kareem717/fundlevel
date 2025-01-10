package postgres

import (
	"context"
	"errors"
	"time"

	"fundlevel/internal/storage"
	"fundlevel/internal/storage/postgres/account"
	"fundlevel/internal/storage/postgres/analytic"
	"fundlevel/internal/storage/postgres/business"
	"fundlevel/internal/storage/postgres/industry"
	"fundlevel/internal/storage/postgres/investment"
	"fundlevel/internal/storage/postgres/position"
	"fundlevel/internal/storage/postgres/round"

	"github.com/alexlast/bunzap"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"go.uber.org/zap"
)

// Config holds database connection configuration
type Config struct {
	URL                   string
	MaxConnections        int32
	MinConnections        int32
	MaxConnectionIdleTime time.Duration
	MaxConnectionLifetime time.Duration
}

// NewConfig creates a new Config with default values
func NewConfig(url string, options ...ConfigOption) Config {
	config := Config{
		URL:                   url,
		MaxConnections:        10,
		MinConnections:        1,
		MaxConnectionIdleTime: time.Hour,
		MaxConnectionLifetime: time.Hour,
	}

	for _, option := range options {
		option(&config)
	}

	return config
}

// Config option functions
type ConfigOption func(*Config)

func WithMaxConnections(maxConnections int32) ConfigOption {
	return func(c *Config) {
		c.MaxConnections = maxConnections
	}
}

func WithMinConnections(minConnections int32) ConfigOption {
	return func(c *Config) {
		c.MinConnections = minConnections
	}
}

func WithMaxConnectionIdleTime(maxConnectionIdleTime time.Duration) ConfigOption {
	return func(c *Config) {
		c.MaxConnectionIdleTime = maxConnectionIdleTime
	}
}

func WithMaxConnectionLifetime(maxConnectionLifetime time.Duration) ConfigOption {
	return func(c *Config) {
		c.MaxConnectionLifetime = maxConnectionLifetime
	}
}

// Repository implements storage.Repository interface
type Repository struct {
	db         *bun.DB
	ctx        context.Context
	logger     *zap.Logger
	account    *account.AccountRepository
	analytic   *analytic.AnalyticRepository
	business   *business.BusinessRepository
	industry   *industry.IndustryRepository
	investment *investment.InvestmentRepository
	position   *position.PositionRepository
	round      *round.RoundRepository
}

// Transaction implements storage.Transaction interface
type transaction struct {
	tx         *bun.Tx
	ctx        context.Context
	account    *account.AccountRepository
	analytic   *analytic.AnalyticRepository
	business   *business.BusinessRepository
	industry   *industry.IndustryRepository
	investment *investment.InvestmentRepository
	position   *position.PositionRepository
	round      *round.RoundRepository
}

// NewRepository creates a new Repository instance
func NewRepository(ctx context.Context, config Config, logger *zap.Logger) storage.Repository {
	poolConfig, err := pgxpool.ParseConfig(config.URL)
	if err != nil {
		logger.Fatal("Error creating pool config", zap.Error(err))
	}

	poolConfig.MaxConns = config.MaxConnections
	poolConfig.MinConns = config.MinConnections
	poolConfig.MaxConnIdleTime = config.MaxConnectionIdleTime
	poolConfig.MaxConnLifetime = config.MaxConnectionLifetime

	sqldb := stdlib.OpenDB(*poolConfig.ConnConfig)
	db := bun.NewDB(sqldb, pgdialect.New())

	db.AddQueryHook(bunzap.NewQueryHook(bunzap.QueryHookOptions{
		Logger:       logger,
		SlowDuration: 200 * time.Millisecond,
	}))

	return &Repository{
		db:         db,
		ctx:        ctx,
		logger:     logger,
		account:    account.NewAccountRepository(db, ctx),
		analytic:   analytic.NewAnalyticRepository(db, ctx),
		business:   business.NewBusinessRepository(db, ctx),
		industry:   industry.NewIndustryRepository(db, ctx),
		investment: investment.NewInvestmentRepository(db, ctx),
		position:   position.NewPositionRepository(db, ctx),
		round:      round.NewRoundRepository(db, ctx),
	}
}

// Repository interface methods
func (r *Repository) Account() storage.AccountRepository       { return r.account }
func (r *Repository) Analytic() storage.AnalyticRepository     { return r.analytic }
func (r *Repository) Business() storage.BusinessRepository     { return r.business }
func (r *Repository) Industry() storage.IndustryRepository     { return r.industry }
func (r *Repository) Investment() storage.InvestmentRepository { return r.investment }
func (r *Repository) Position() storage.PositionRepository     { return r.position }
func (r *Repository) Round() storage.RoundRepository           { return r.round }
func (r *Repository) Shutdown(ctx context.Context) error       { r.db.Close(); return nil }

// Transaction interface methods
func (t *transaction) Account() storage.AccountRepository       { return t.account }
func (t *transaction) Analytic() storage.AnalyticRepository     { return t.analytic }
func (t *transaction) Business() storage.BusinessRepository     { return t.business }
func (t *transaction) Industry() storage.IndustryRepository     { return t.industry }
func (t *transaction) Investment() storage.InvestmentRepository { return t.investment }
func (t *transaction) Position() storage.PositionRepository     { return t.position }
func (t *transaction) Round() storage.RoundRepository           { return t.round }
func (t *transaction) Commit() error                            { return t.tx.Commit() }
func (t *transaction) Rollback() error                          { return t.tx.Rollback() }
func (t *transaction) SubTransaction() (storage.Transaction, error) {
	tx, err := t.tx.BeginTx(t.ctx, nil)
	if err != nil {
		return nil, err
	}
	return &transaction{
		tx:         &tx,
		ctx:        t.ctx,
		account:    account.NewAccountRepository(tx, t.ctx),
		analytic:   analytic.NewAnalyticRepository(tx, t.ctx),
		business:   business.NewBusinessRepository(tx, t.ctx),
		industry:   industry.NewIndustryRepository(tx, t.ctx),
		investment: investment.NewInvestmentRepository(tx, t.ctx),
		position:   position.NewPositionRepository(tx, t.ctx),
		round:      round.NewRoundRepository(tx, t.ctx),
	}, nil
}

// Transaction management
func (r *Repository) NewTransaction() (storage.Transaction, error) {
	tx, err := r.db.BeginTx(r.ctx, nil)
	if err != nil {
		return nil, err
	}

	return &transaction{
		tx:         &tx,
		ctx:        r.ctx,
		account:    account.NewAccountRepository(tx, r.ctx),
		analytic:   analytic.NewAnalyticRepository(tx, r.ctx),
		business:   business.NewBusinessRepository(tx, r.ctx),
		industry:   industry.NewIndustryRepository(tx, r.ctx),
		investment: investment.NewInvestmentRepository(tx, r.ctx),
		position:   position.NewPositionRepository(tx, r.ctx),
		round:      round.NewRoundRepository(tx, r.ctx),
	}, nil
}

func (r *Repository) RunInTx(ctx context.Context, fn func(ctx context.Context, tx storage.Transaction) error) error {
	tx, err := r.NewTransaction()
	if err != nil {
		return err
	}

	if err := fn(ctx, tx); err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit()
}

func (r *Repository) HealthCheck(ctx context.Context) error {
	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	r.logger.Info("Attempting to ping the database...")
	if err := r.db.PingContext(pingCtx); err != nil {
		switch {
		case errors.Is(err, context.Canceled):
			r.logger.Fatal("ping was canceled by the client", zap.Error(err))
		case errors.Is(err, context.DeadlineExceeded):
			r.logger.Fatal("ping timed out", zap.Error(err))
		default:
			r.logger.Fatal("ping failed", zap.Error(err))
		}
		return err
	}

	r.logger.Info("Successfully connected to the database")
	return nil
}
