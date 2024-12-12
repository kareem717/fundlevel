package main

import (
	"context"
	"fmt"
	"os"
	"strconv"

	server "fundlevel/internal/server"
	"fundlevel/internal/service"
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
	APIName            string `help:"API Name" short:"a"`
	APIVersion         string `help:"API Version" short:"v"`
	BaseURL            string `help:"Base API URL" short:"B"`
	SupabaseHost       string `help:"Supabase Host" short:"s"`
	SupabaseServiceKey string `help:"Supabase Service Key" short:"k"`

	StripeAPIKey               string `help:"Stripe API Key" short:"S"`
	FeePercentage              string `help:"Fee Percentage" short:"f"`
	TransactionFeeProductID    string `help:"Transaction Fee Product ID" short:"T"`
	InvestmentFeeProductID     string `help:"Investment Fee Product ID" short:"I"`
	StripeWebhookSecret        string `help:"Stripe Webhook Secret" short:"W"`
	StripeConnectWebhookSecret string `help:"Stripe Connect Webhook Secret" short:"C"`
}

func (o *Options) config() {
	if port, err := strconv.Atoi(os.Getenv("PORT")); err == nil {
		o.Port = port
	}

	o.DatabaseURL = os.Getenv("DATABASE_URL")
	o.BaseURL = os.Getenv("BASE_API_URL")
	o.SupabaseHost = os.Getenv("SUPABASE_HOST")
	o.SupabaseServiceKey = os.Getenv("SUPABASE_SERVICE_KEY")

	o.StripeAPIKey = os.Getenv("STRIPE_API_KEY")
	o.TransactionFeeProductID = os.Getenv("TRANSACTION_FEE_PRODUCT_ID")
	o.InvestmentFeeProductID = os.Getenv("INVESTMENT_FEE_PRODUCT_ID")
	o.StripeWebhookSecret = os.Getenv("STRIPE_WEBHOOK_SECRET")
	o.StripeConnectWebhookSecret = os.Getenv("STRIPE_CONNECT_WEBHOOK_SECRET")
	o.FeePercentage = os.Getenv("FEE_PERCENTAGE")

}

func main() {
	// Load environment variables from .env.local
	err := godotenv.Load(".env.local")
	if err != nil {
		fmt.Println("Error loading .env.local file")
	}

	cli := humacli.New(func(hooks humacli.Hooks, options *Options) {
		options.config()

		ctx := context.Background()
		logger := zap.New(
			zapcore.NewCore(
				zapcore.NewJSONEncoder(zap.NewProductionConfig().EncoderConfig),
				zapcore.AddSync(os.Stdout), zap.InfoLevel))

		repositories, err := postgres.NewRepository(
			options.DatabaseURL,
			logger,
			ctx,
		)
		if err != nil {
			logger.Fatal("Failed to create repository layer", zap.Error(err))
		}

		feePercentage, err := strconv.ParseFloat(options.FeePercentage, 64)
		if err != nil {
			panic(fmt.Sprintf("Failed to parse FEE_PERCENTAGE: %v", err))
		}
		services := service.NewService(
			repositories,
			options.StripeAPIKey,
			feePercentage,
		)

		supabaseClient, err := supabase.NewClient(
			options.SupabaseHost,
			options.SupabaseServiceKey,
			&supabase.ClientOptions{},
		)
		if err != nil {
			logger.Fatal("Failed to create supabase client", zap.Error(err))
		}

		server := server.NewServer(
			&server.ServerConfig{
				Services:                   services,
				APIName:                    options.APIName,
				APIVersion:                 options.APIVersion,
				Logger:                     logger,
				SupabaseClient:             supabaseClient,
				StripeWebhookSecret:        options.StripeWebhookSecret,
				StripeConnectWebhookSecret: options.StripeConnectWebhookSecret,
			},
		)

		hooks.OnStart(func() {
			fmt.Printf("Starting server on port %d...\n", options.Port)
			server.Serve(fmt.Sprintf(":%d", options.Port))
		})
	})

	cli.Run()
}
