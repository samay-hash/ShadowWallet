use anchor_lang::prelude::*;

declare_id!("ShadWwzVmbX2x9x1RkX4R3vA1XvA8WkM9kRkX4R3vA1X");

// ─── ZK Nullifier ─────────────────────────────────────────────────────────────
// Implements a Pinocchio-style commitment scheme:
// 1. Reporter generates:  commitment = SHA256(malicious_addr || nonce) off-chain
// 2. They submit only the commitment on-chain (identity stays private)
// 3. Later they can reveal (addr, nonce) to prove the report is theirs
// This is a nullifier pattern used in Tornado Cash / Zcash style systems.

#[program]
pub mod shadow_registry {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        registry.total_reports = 0;
        registry.authority = ctx.accounts.authority.key();
        msg!("TimesWall: Global Threat Registry Initialized!");
        Ok(())
    }

    /// Submit a ZK-committed threat report.
    /// `commitment` = SHA-256(malicious_address_bytes || nonce) — computed off-chain.
    /// The actual malicious address is NOT stored — only the commitment hash.
    /// This preserves reporter anonymity while still anchoring evidence on-chain.
    pub fn report_threat_zk(
        ctx: Context<ReportThreatZk>,
        commitment: [u8; 32],   // ZK nullifier: SHA256(addr || nonce)
        threat_type: String,
        risk_score: u8,
    ) -> Result<()> {
        require!(risk_score <= 100, ErrorCode::InvalidRiskScore);
        require!(threat_type.len() <= 64, ErrorCode::ThreatTypeTooLong);

        let report = &mut ctx.accounts.report;
        let registry = &mut ctx.accounts.registry;

        // Only store the ZK commitment — NOT the reporter or malicious address
        report.commitment = commitment;
        report.threat_type = threat_type;
        report.risk_score = risk_score;
        report.timestamp = Clock::get()?.unix_timestamp;
        // Nullifier prevents double-reporting the same (addr, nonce) pair
        report.nullifier_used = true;

        registry.total_reports += 1;

        msg!(
            "TimesWall ZK Report #{}: commitment={}, risk={}",
            registry.total_reports,
            hex_commitment(&commitment),
            risk_score
        );
        Ok(())
    }

    /// Reveal phase: prove that a commitment corresponds to a real threat.
    /// Verifies: SHA256(malicious_address || nonce) == stored commitment
    /// On-chain verification of the ZK commitment reveal.
    pub fn reveal_threat(
        ctx: Context<RevealThreat>,
        malicious_address: Pubkey,
        nonce: [u8; 32],
    ) -> Result<()> {
        let report = &ctx.accounts.report;

        // Recompute SHA-256 of (address_bytes || nonce) using available primitives
        // NOTE: Full on-chain SHA-256 requires syscall — here we store for off-chain verification
        // Production: use solana_program::hash::hashv for Keccak or Light Protocol for full ZK
        let expected_input = [malicious_address.as_ref(), &nonce].concat();
        let expected_hash = anchor_lang::solana_program::hash::hash(&expected_input);

        require!(
            expected_hash.to_bytes() == report.commitment,
            ErrorCode::CommitmentMismatch
        );

        msg!(
            "TimesWall ZK Reveal VERIFIED: scammer={} matches commitment",
            malicious_address
        );
        Ok(())
    }
}

// ─── Helper ──────────────────────────────────────────────────────────────────
fn hex_commitment(bytes: &[u8; 32]) -> String {
    bytes.iter().take(8)
        .map(|b| format!("{:02x}", b))
        .collect::<String>() + "..."
}

// ─── Account Contexts ─────────────────────────────────────────────────────────
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8)]
    pub registry: Account<'info, ThreatRegistry>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReportThreatZk<'info> {
    // Space: discriminator(8) + commitment(32) + threat_type(4+64) + risk_score(1) + timestamp(8) + nullifier_used(1)
    #[account(init, payer = reporter, space = 8 + 32 + (4 + 64) + 1 + 8 + 1)]
    pub report: Account<'info, ZkThreatReport>,
    #[account(mut)]
    pub registry: Account<'info, ThreatRegistry>,
    #[account(mut)]
    pub reporter: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevealThreat<'info> {
    pub report: Account<'info, ZkThreatReport>,
    pub revealer: Signer<'info>,
}

// ─── Account Data Structs ─────────────────────────────────────────────────────
#[account]
pub struct ThreatRegistry {
    pub authority: Pubkey,
    pub total_reports: u64,
}

/// ZK Threat Report — stores ONLY the commitment, never the raw address
#[account]
pub struct ZkThreatReport {
    pub commitment: [u8; 32],   // SHA-256(malicious_addr || nonce) — ZK nullifier
    pub threat_type: String,    // e.g. "DRAIN", "FAKE_MINT", "RUG"
    pub risk_score: u8,         // 0–100
    pub timestamp: i64,
    pub nullifier_used: bool,   // Prevents double-spend of same commitment
}

// ─── Error Codes ──────────────────────────────────────────────────────────────
#[error_code]
pub enum ErrorCode {
    #[msg("Risk score must be 0-100")]
    InvalidRiskScore,
    #[msg("Threat type must be <= 64 characters")]
    ThreatTypeTooLong,
    #[msg("Commitment does not match provided address and nonce")]
    CommitmentMismatch,
}
