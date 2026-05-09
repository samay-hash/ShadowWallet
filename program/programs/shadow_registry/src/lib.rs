use anchor_lang::prelude::*;

declare_id!("ShadWwzVmbX2x9x1RkX4R3vA1XvA8WkM9kRkX4R3vA1X");

#[program]
pub mod shadow_registry {
    use super::*;


    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        registry.total_reports = 0;
        registry.authority = ctx.accounts.authority.key();
        msg!("ShadowWallet: Global Threat Registry Initialized!");
        Ok(())
    }

    pub fn report_threat(
        ctx: Context<ReportThreat>, 
        malicious_address: Pubkey, 
        threat_type: String, 
        risk_score: u8
    ) -> Result<()> {
        let report = &mut ctx.accounts.report;
        let registry = &mut ctx.accounts.registry;

        report.reporter = ctx.accounts.reporter.key();
        report.malicious_address = malicious_address;
        report.threat_type = threat_type;
        report.risk_score = risk_score;
        report.timestamp = Clock::get()?.unix_timestamp;

        registry.total_reports += 1;

        msg!("ShadowWallet: New Threat Reported! Scammer Address: {}", malicious_address);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8)]
    pub registry: Account<'info, ThreatRegistry>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReportThreat<'info> {
    #[account(init, payer = reporter, space = 8 + 32 + 32 + (4 + 128) + 1 + 8)] // discriminator + reporter + malicious_addr + threat_type(String) + risk_score + timestamp
    pub report: Account<'info, ThreatReport>,
    #[account(mut)]
    pub registry: Account<'info, ThreatRegistry>,
    #[account(mut)]
    pub reporter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct ThreatRegistry {
    pub authority: Pubkey,
    pub total_reports: u64,
}

#[account]
pub struct ThreatReport {
    pub reporter: Pubkey,
    pub malicious_address: Pubkey,
    pub threat_type: String,
    pub risk_score: u8,
    pub timestamp: i64,
}
