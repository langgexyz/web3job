use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo, Burn, Transfer, Token, TokenAccount, Mint};

declare_id!("9q76qB4ieWmZzQ3tbgqtKNtLScBj4QD3w5942GEBsjqz");

#[program]
pub mod spltoken {
    use super::*;

    pub fn mint_tokens(ctx:Context<MintTokens>, amount:u64) -> Result<()> {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.to.to_account_info(),
                authority: ctx.accounts.mint_authority.to_account_info(),
            },
        );
        token::mint_to(cpi_ctx, amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    pub mint:Account<'info, Mint>,
    #[account(mut)]
    pub to:Account<'info, TokenAccount>,
    pub mint_authority:Signer<'info>,
    pub token_program:Program<'info, Token>,
}