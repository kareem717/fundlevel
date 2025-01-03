package postgres

import (
	"context"
	"errors"
	"time"

	"fundlevel/internal/storage"
	"fundlevel/internal/storage/postgres/account"
	"fundlevel/internal/storage/postgres/analytic"
	"fundlevel/internal/storage/postgres/business"
	"fundlevel/internal/storage/postgres/chat"
	"fundlevel/internal/storage/postgres/industry"
	"fundlevel/internal/storage/postgres/investment"
	"fundlevel/internal/storage/postgres/position"
	"fundlevel/internal/storage/postgres/round"
	"fundlevel/internal/storage/postgres/user"
	"fundlevel/internal/storage/postgres/worker"

	businessEntity "fundlevel/internal/entities/business"

	"github.com/alexlast/bunzap"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/riverqueue/river"
	"github.com/riverqueue/river/riverdriver/riverpgxv5"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"go.uber.org/zap"
)

// type Config struct {
// 	URL                   string
// 	MaxConnections        int32
// 	MinConnections        int32
// 	MaxConnectionIdleTime time.Duration
// 	MaxConnectionLifetime time.Duration
// }

// func NewConfig(url string, options ...ConfigOption) Config {
// 	config := Config{
// 		URL:                   url,
// 		MaxConnections:        10,
// 		MinConnections:        1,
// 		MaxConnectionIdleTime: 1 * time.Hour,
// 		MaxConnectionLifetime: 1 * time.Hour,
// 	}

// 	for _, option := range options {
// 		option(&config)
// 	}

//		return config
//	}
type ConfigOption func(*pgxpool.Config)

func WithMaxConnections(maxConnections int32) ConfigOption {
	return func(c *pgxpool.Config) {
		c.MaxConns = maxConnections
	}
}

func WithMinConnections(minConnections int32) ConfigOption {
	return func(c *pgxpool.Config) {
		c.MinConns = minConnections
	}
}

func WithMaxConnectionIdleTime(maxConnectionIdleTime time.Duration) ConfigOption {
	return func(c *pgxpool.Config) {
		c.MaxConnIdleTime = maxConnectionIdleTime
	}
}

func WithMaxConnectionLifetime(maxConnectionLifetime time.Duration) ConfigOption {
	return func(c *pgxpool.Config) {
		c.MaxConnLifetime = maxConnectionLifetime
	}
}

// func configDBPool(config Config) (*pgxpool.Config, error) {
// 	poolConfig, err := pgxpool.ParseConfig(config.URL)
// 	if err != nil {
// 		return nil, err
// 	}

// 	poolConfig.MaxConns = config.MaxConnections
// 	poolConfig.MinConns = config.MinConnections
// 	poolConfig.MaxConnIdleTime = config.MaxConnectionIdleTime
// 	poolConfig.MaxConnLifetime = config.MaxConnectionLifetime

// 	return poolConfig, nil
// }

type transaction struct {
	positionRepo   *position.PositionRepository
	accountRepo    *account.AccountRepository
	roundRepo      *round.RoundRepository
	userRepo       *user.UserRepository
	investmentRepo *investment.InvestmentRepository
	industryRepo   *industry.IndustryRepository
	chatRepo       *chat.ChatRepository
	businessRepo   *business.BusinessRepository
	analyticRepo   *analytic.AnalyticRepository
	tx             *bun.Tx
	ctx            context.Context
}

func (t *transaction) Account() storage.AccountRepository {
	return t.accountRepo
}

func (t *transaction) Chat() storage.ChatRepository {
	return t.chatRepo
}

func (t *transaction) Round() storage.RoundRepository {
	return t.roundRepo
}

func (t *transaction) User() storage.UserRepository {
	return t.userRepo
}

func (t *transaction) Business() storage.BusinessRepository {
	return t.businessRepo
}

func (t *transaction) Analytic() storage.AnalyticRepository {
	return t.analyticRepo
}

func (t *transaction) Investment() storage.InvestmentRepository {
	return t.investmentRepo
}

func (t *transaction) Industry() storage.IndustryRepository {
	return t.industryRepo
}

func (t *transaction) Position() storage.PositionRepository {
	return t.positionRepo
}

func (t *transaction) Commit() error {
	return t.tx.Commit()
}

func (t *transaction) Rollback() error {
	return t.tx.Rollback()
}

func (t *transaction) SubTransaction() (storage.Transaction, error) {
	tx, err := t.tx.BeginTx(t.ctx, nil)
	if err != nil {
		return nil, err
	}

	return &transaction{
		positionRepo:   position.NewPositionRepository(tx, t.ctx),
		accountRepo:    account.NewAccountRepository(tx, t.ctx),
		roundRepo:      round.NewRoundRepository(tx, t.ctx),
		chatRepo:       chat.NewChatRepository(tx, t.ctx),
		userRepo:       user.NewUserRepository(tx, t.ctx),
		analyticRepo:   analytic.NewAnalyticRepository(tx, t.ctx),
		investmentRepo: investment.NewInvestmentRepository(tx, t.ctx),
		industryRepo:   industry.NewIndustryRepository(tx, t.ctx),
		businessRepo:   business.NewBusinessRepository(tx, t.ctx),
		tx:             &tx,
	}, nil
}

type Repository struct {
	positionRepo   *position.PositionRepository
	accountRepo    *account.AccountRepository
	roundRepo      *round.RoundRepository
	userRepo       *user.UserRepository
	chatRepo       *chat.ChatRepository
	investmentRepo *investment.InvestmentRepository
	workerRepo     *worker.WorkerRepository
	industryRepo   *industry.IndustryRepository
	businessRepo   *business.BusinessRepository
	analyticRepo   *analytic.AnalyticRepository
	riverClient    *river.Client[pgx.Tx]
	db             *bun.DB
	ctx            context.Context
	pgxPool        *pgxpool.Pool
}

// func NewDB(config Config, ctx context.Context, logger *zap.Logger) (*bun.DB, error) {

// }

func NewRepository(
	// db *bun.DB,
	url string,
	logger *zap.Logger,
	ctx context.Context,
	opts ...ConfigOption,
) (*Repository, error) {
	poolConfig, err := pgxpool.ParseConfig(url)
	if err != nil {
		return nil, err
	}

	// set default options
	poolConfig.MaxConns = 10
	poolConfig.MinConns = 1
	poolConfig.MaxConnIdleTime = 1 * time.Hour
	poolConfig.MaxConnLifetime = 1 * time.Hour

	for _, opt := range opts {
		opt(poolConfig)
	}

	sqldb := stdlib.OpenDB(*poolConfig.ConnConfig)
	db := bun.NewDB(sqldb, pgdialect.New())

	db.AddQueryHook(bunzap.NewQueryHook(bunzap.QueryHookOptions{
		Logger:       logger,
		SlowDuration: 200 * time.Millisecond, // Omit to log all operations as debug
	}))

	// Increase timeout duration
	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	logger.Info("Attempting to ping the database (1/2)...")
	err = db.PingContext(pingCtx)
	if err != nil {
		switch {
		case errors.Is(err, context.Canceled):
			logger.Fatal("ping was canceled by the client: %v", zap.Error(err))
		case errors.Is(err, context.DeadlineExceeded):
			logger.Fatal("ping timed out: %v", zap.Error(err))
		default:
			logger.Fatal("ping failed: %v", zap.Error(err))
		}
	}

	db.RegisterModel((*businessEntity.BusinessIndustries)(nil))
	db.RegisterModel((*businessEntity.BusinessMemberRolePermissionAssignment)(nil))

	// Create the pool
	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return nil, err
	}

	logger.Info("Attempting to ping the database (2/2)...")
	err = pool.Ping(ctx)
	if err != nil {
		return nil, err
	}

	logger.Info("Successfully connected to the database.")

	workerRepo, err := worker.NewWorkerRepository(db, ctx)
	if err != nil {
		return nil, err
	}

	riverClient, err := river.NewClient(riverpgxv5.New(pool), &river.Config{
		Queues: map[string]river.QueueConfig{
			river.QueueDefault: {MaxWorkers: 100},
		},
		Workers: workerRepo.Workers,
	})
	if err != nil {
		// handle error
	}

	return &Repository{
		positionRepo:   position.NewPositionRepository(db, ctx),
		accountRepo:    account.NewAccountRepository(db, ctx),
		roundRepo:      round.NewRoundRepository(db, ctx),
		userRepo:       user.NewUserRepository(db, ctx),
		investmentRepo: investment.NewInvestmentRepository(db, ctx),
		workerRepo:     workerRepo,
		industryRepo:   industry.NewIndustryRepository(db, ctx),
		chatRepo:       chat.NewChatRepository(db, ctx),
		businessRepo:   business.NewBusinessRepository(db, ctx),
		analyticRepo:   analytic.NewAnalyticRepository(db, ctx),
		db:             db,
		ctx:            ctx,
		pgxPool:        pool,
		riverClient:    riverClient,
	}, nil
}

func (r *Repository) Shutdown(ctx context.Context) error {
	err := r.db.Close()
	if err != nil {
		return err
	}

	if err := r.riverClient.Stop(ctx); err != nil {
		return err
	}

	r.pgxPool.Close()

	return nil
}

func (r *Repository) Chat() storage.ChatRepository {
	return r.chatRepo
}

func (r *Repository) Account() storage.AccountRepository {
	return r.accountRepo
}

func (r *Repository) Round() storage.RoundRepository {
	return r.roundRepo
}

func (r *Repository) Industry() storage.IndustryRepository {
	return r.industryRepo
}

func (r *Repository) Investment() storage.InvestmentRepository {
	return r.investmentRepo
}

func (r *Repository) User() storage.UserRepository {
	return r.userRepo
}

func (r *Repository) Business() storage.BusinessRepository {
	return r.businessRepo
}

func (r *Repository) Analytic() storage.AnalyticRepository {
	return r.analyticRepo
}

func (r *Repository) Position() storage.PositionRepository {
	return r.positionRepo
}

func (r *Repository) HealthCheck(ctx context.Context) error {
	return r.db.PingContext(ctx)
}

func (r *Repository) NewTransaction() (storage.Transaction, error) {
	tx, err := r.db.BeginTx(r.ctx, nil)
	if err != nil {
		return nil, err
	}

	return &transaction{
		positionRepo:   position.NewPositionRepository(tx, r.ctx),
		accountRepo:    account.NewAccountRepository(tx, r.ctx),
		userRepo:       user.NewUserRepository(tx, r.ctx),
		roundRepo:      round.NewRoundRepository(tx, r.ctx),
		chatRepo:       chat.NewChatRepository(tx, r.ctx),
		investmentRepo: investment.NewInvestmentRepository(tx, r.ctx),
		industryRepo:   industry.NewIndustryRepository(tx, r.ctx),
		businessRepo:   business.NewBusinessRepository(tx, r.ctx),
		analyticRepo:   analytic.NewAnalyticRepository(tx, r.ctx),
		tx:             &tx,
		ctx:            r.ctx,
	}, nil
}

func (r *Repository) RunInTx(ctx context.Context, fn func(ctx context.Context, tx storage.Transaction) error) error {
	tx, err := r.NewTransaction()
	if err != nil {
		return err
	}

	err = fn(ctx, tx)
	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit()
}
