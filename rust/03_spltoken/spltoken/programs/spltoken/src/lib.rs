use anchor_lang::prelude::*;
use anchor_spl::token::{self, MintTo, Burn, Transfer, Token, TokenAccount, Mint};
use anchor_lang::solana_program::sysvar::instructions::load_instruction_at_checked;
use anchor_lang::solana_program::sysvar::instructions::load_current_index_checked;
use anchor_lang::solana_program::sysvar::instructions::ID as IX_ID;

declare_id!("B5LHB5cW784EDckM1aEVr9RkcesfufUYcPaa1SqUdvSj");

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

    pub fn cpi_mint_tokens(ctx:Context<MintTokens>, amount:u64) -> Result<()> {
        let expected_caller: Pubkey = "5LixViAAm5pyV1rjExDKvxdWRuCBYJ8tdsLzxJi96an8".parse().unwrap();
        let ix_sysvar_account = ctx.accounts.ix_sysvar.to_account_info();
        let current_index = load_current_index_checked(&ix_sysvar_account)?;
        let caller_ix = load_instruction_at_checked(current_index.into(), &ix_sysvar_account)?;
        msg!("[index {}]: Program ID = {}",  current_index, caller_ix.program_id);
        require!(
            caller_ix.program_id == expected_caller,
            CustomError::UnauthorizedCaller
        );

        mint_tokens(ctx, amount)?;
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
            Burn {
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

    /// CHECK: sysvar
    #[account(address = IX_ID)]
    pub ix_sysvar: AccountInfo<'info>,
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

#[error_code]
pub enum CustomError {
    #[msg("Only authorized programs can call this function")]
    UnauthorizedCaller,

    #[msg("CPI context invalid: No previous instruction.")]
    InvalidCpiContext,
}