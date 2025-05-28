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

    pub fn transfer_tokens(ctx:Context<TransferTokens>, amount:u64) -> Result<()> {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from:ctx.accounts.from.to_account_info(),
                to:ctx.accounts.to.to_account_info(),
                authority:ctx.accounts.authority.to_account_info(),
            }
        );

        token::transfer(cpi_ctx, amount)?;
        Ok(())
    }

    pub fn burn_tokens(ctx:Context<BurnTokens>, amount:u64) -> Result<()> {
        let cpi_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            anchor_spl::token::Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.from.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
            },
        );
        token::burn(cpi_ctx, amount)?;
        Ok(())
    }
}

// TODO Account 和 AccountInfo 有什么区别？
#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    pub mint:Account<'info, Mint>,
    #[account(mut)]
    pub to:Account<'info, TokenAccount>,
    pub mint_authority:Signer<'info>,
    pub token_program:Program<'info, Token>,
}

#[derive(Accounts)]
pub struct TransferTokens<'info> {
    #[account(mut)]
    pub from:Account<'info, TokenAccount>,
    #[account(mut)]
    pub to:Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program:Program<'info, Token>,
}

// TODO Burn 可以燃烧别人钱包的代币？
#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,

    // TODO has_one 是什么意思？
    #[account(mut, constraint = from.owner == authority.key())]
    pub from: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub token_program:Program<'info, Token>,
}