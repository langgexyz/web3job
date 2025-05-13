use anchor_lang::prelude::*;

declare_id!("tdeCmVc559AJhzH93DTrBRms3H3i9KNdc7Ef4AtMMkD");

#[program]
pub mod solana_anchor_demo {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
