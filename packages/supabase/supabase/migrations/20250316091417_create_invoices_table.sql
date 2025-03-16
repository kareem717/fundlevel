CREATE TYPE invoice_types AS ENUM('ACCOUNTS_RECEIVABLE', 'ACCOUNTS_PAYABLE');

CREATE TYPE invoice_statuses AS ENUM(
    'PAID',
    'DRAFT',
    'SUBMITTED',
    'PARTIALLY_PAID',
    'OPEN',
    'VOID'
);

CREATE TYPE invoice_currencies AS ENUM(
    'USD',
    'EUR',
    'GBP',
    'CAD',
    'AUD',
    'JPY',
    'CNY',
    'INR',
    'BRL',
    'MXN'
);

CREATE TABLE
    merge_invoices (
        id SERIAL PRIMARY KEY NOT NULL,
        linked_account_id INT REFERENCES linked_accounts (id) NOT NULL,
        integration_remote_id TEXT,
        merge_id UUID,
        modified_at TIMESTAMP WITH TIME ZONE,
        TYPE invoice_types,
        contact_id UUID,
        number TEXT,
        issue_date TIMESTAMP WITH TIME ZONE,
        due_date TIMESTAMP WITH TIME ZONE,
        paid_on_date TIMESTAMP WITH TIME ZONE,
        memo TEXT,
        company_id UUID,
        employee_id UUID,
        currency invoice_currencies,
        exchange_rate TEXT,
        payment_term_id UUID,
        total_discount DECIMAL,
        sub_total DECIMAL,
        status invoice_statuses,
        total_tax_amount DECIMAL,
        total_amount DECIMAL,
        balance DECIMAL,
        remote_updated_at TIMESTAMP WITH TIME ZONE,
        tracking_categories JSONB,
        accounting_period_id UUID,
        purchase_orders JSONB,
        payments JSONB,
        applied_payments JSONB,
        line_items JSONB,
        inclusive_of_tax BOOLEAN,
        remote_was_deleted BOOLEAN,
        field_mappings JSONB,
        remote_data JSONB,
        remote_fields JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE
    );