CREATE TYPE plaid_account_type AS ENUM(
    'investment',
    'credit',
    'depository',
    'loan',
    'brokerage',
    'other'
);

CREATE TYPE plaid_account_subtype AS ENUM(
    '401a',
    '401k',
    '403B',
    '457b',
    '529',
    'auto',
    'brokerage',
    'business',
    'cash isa',
    'cash management',
    'cd',
    'checking',
    'commercial',
    'construction',
    'consumer',
    'credit card',
    'crypto exchange',
    'ebt',
    'education savings account',
    'fixed annuity',
    'gic',
    'health reimbursement arrangement',
    'home equity',
    'hsa',
    'isa',
    'ira',
    'keogh',
    'lif',
    'life insurance',
    'line of credit',
    'lira',
    'loan',
    'lrif',
    'lrsp',
    'money market',
    'mortgage',
    'mutual fund',
    'non-custodial wallet',
    'non-taxable brokerage account',
    'other',
    'other insurance',
    'other annuity',
    'overdraft',
    'paypal',
    'payroll',
    'pension',
    'prepaid',
    'prif',
    'profit sharing plan',
    'rdsp',
    'resp',
    'retirement',
    'rlif',
    'roth',
    'roth 401k',
    'rrif',
    'rrsp',
    'sarsep',
    'savings',
    'sep ira',
    'simple ira',
    'sipp',
    'stock plan',
    'student',
    'thrift savings plan',
    'tfsa',
    'trust',
    'ugma',
    'utma',
    'variable annuity'
);

CREATE TABLE
    plaid_bank_accounts (
        remote_id TEXT NOT NULL PRIMARY KEY,
        company_id INT REFERENCES companies (id) NOT NULL,
        available_balance DOUBLE PRECISION,
        current_balance DOUBLE PRECISION,
        iso_currency_code VARCHAR(3),
        unofficial_currency_code VARCHAR(3),
        mask VARCHAR(4),
        NAME TEXT NOT NULL,
        official_name TEXT,
        TYPE plaid_account_type NOT NULL,
        subtype plaid_account_subtype,
        remaining_remote_content JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE,
        CHECK (
            (
                iso_currency_code IS NOT NULL
                AND unofficial_currency_code IS NULL
            )
            OR (
                iso_currency_code IS NULL
                AND unofficial_currency_code IS NOT NULL
            )
        )
    );

COMMENT ON TABLE plaid_bank_accounts IS 'Models https://plaid.com/docs/api/accounts/#accounts-get-response-accounts';

CREATE TRIGGER plaid_bank_accounts_updated_at_timestamp BEFORE
UPDATE ON plaid_bank_accounts FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp ();