package main

import (
	"context"
	"fmt"
	"os"
	"strconv"
	"strings"

	server "fundlevel/internal/server"
	"fundlevel/internal/service"
	"fundlevel/internal/service/domain/billing"
	"fundlevel/internal/storage/postgres"

	"github.com/danielgtaylor/huma/v2/humacli"
	"github.com/joho/godotenv"
	"github.com/supabase-community/supabase-go"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

type Options struct {
	Port               int    `help:"Port to listen on" short:"p" default:"8080"`
	DatabaseURL        string `help:"Database URL" short:"d"`
	APIName            string `help:"API Name" short:"n"`
	APIVersion         string `help:"API Version" short:"v"`
	BaseURL            string `help:"Base API URL" short:"B"`
	SupabaseHost       string `help:"Supabase Host" short:"s"`
	SupabaseServiceKey string `help:"Supabase Service Key" short:"k"`

	StripeAPIKey            string `help:"Stripe API Key" short:"S"`
	FeePercentage           string `help:"Fee Percentage" short:"f"`
	TransactionFeeProductID string `help:"Transaction Fee Product ID" short:"T"`
	InvestmentFeeProductID  string `help:"Investment Fee Product ID" short:"I"`
	StripeWebhookSecret     string `help:"Stripe Webhook Secret" short:"W"`
}

func (o *Options) config() {
	if port, err := strconv.Atoi(os.Getenv("PORT")); err == nil {
		o.Port = port
	}

	o.DatabaseURL = os.Getenv("DATABASE_URL")
	o.APIName = os.Getenv("API_NAME")
	o.APIVersion = os.Getenv("API_VERSION")
	o.BaseURL = os.Getenv("BASE_API_URL")
	o.SupabaseHost = os.Getenv("SUPABASE_HOST")
	o.SupabaseServiceKey = os.Getenv("SUPABASE_SERVICE_KEY")

	o.StripeAPIKey = os.Getenv("STRIPE_API_KEY")
	o.TransactionFeeProductID = os.Getenv("TRANSACTION_FEE_PRODUCT_ID")
	o.InvestmentFeeProductID = os.Getenv("INVESTMENT_FEE_PRODUCT_ID")
	o.StripeWebhookSecret = os.Getenv("STRIPE_WEBHOOK_SECRET")
	o.FeePercentage = os.Getenv("FEE_PERCENTAGE")

}

func main() {
	// Load environment variables from .env.local
	err := godotenv.Load(".env.local")
	if err != nil {
		fmt.Println("Error loading .env.local file")
	}

	allowedIPs := os.Getenv("ALLOWED_IPS")
	parsedAllowedIPs := strings.Split(allowedIPs, ",")
	if len(parsedAllowedIPs) == 0 {
		panic("ALLOWED_IPS is not set")
	}

	cli := humacli.New(func(hooks humacli.Hooks, options *Options) {
		options.config()

		ctx := context.Background()
		logger := zap.New(
			zapcore.NewCore(
				zapcore.NewJSONEncoder(zap.NewProductionConfig().EncoderConfig),
				zapcore.AddSync(os.Stdout), zap.InfoLevel))

		postgresConfig := postgres.NewConfig(options.DatabaseURL)
		db, err := postgres.NewDB(postgresConfig, ctx, logger)
		if err != nil {
			logger.Fatal("Failed to create database", zap.Error(err))
		}

		repositories := postgres.NewRepository(db, ctx)

		feePercentage, err := strconv.ParseFloat(options.FeePercentage, 64)
		if err != nil {
			panic(fmt.Sprintf("Failed to parse FEE_PERCENTAGE: %v", err))
		}
		services := service.NewService(repositories, billing.BillingServiceConfig{
			APIKey:                  options.StripeAPIKey,
			FeePercentage:           feePercentage,
			TransactionFeeProductID: options.TransactionFeeProductID,
			InvestmentFeeProductID:  options.InvestmentFeeProductID,
		})

		supabaseClient, err := supabase.NewClient(
			options.SupabaseHost,
			options.SupabaseServiceKey,
			&supabase.ClientOptions{},
		)
		if err != nil {
			logger.Fatal("Failed to create supabase client", zap.Error(err))
		}

		server := server.NewServer(
			services,
			options.APIName,
			options.APIVersion,
			logger,
			supabaseClient,
			options.StripeWebhookSecret,
			parsedAllowedIPs,
		)

		hooks.OnStart(func() {
			fmt.Printf("Starting server on port %d...\n", options.Port)
			server.Serve(fmt.Sprintf(":%d", options.Port))
		})
	})

	cli.Run()
}
