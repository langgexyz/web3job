use anchor_lang::prelude::*;
use anchor_spl::token::{Token, TokenAccount, Mint};
use spltoken::program::Spltoken;
use anchor_lang::solana_program::sysvar::instructions::ID as IX_ID;

declare_id!("MVyr524TCDeXQSkmaZDFJertE3y1Ua4o9KnEZQCosna");

#[program]
pub mod spltokencpi {
    use super::*;

    pub fn mint_tokens(ctx:Context<CpiMintTokens>, amount:u64) -> Result<()> {
        // TODO ?是什么意思？
        // 如果这个操作返回 Err(e)，就立刻返回这个错误；否则提取出 Ok(value) 中的值。
        // match spltoken::cpi::mint_tokens(ctx.accounts.to_cpi_ctx(), amount) {
        //     Ok(_) => {},                   // 执行成功，继续往下走
        //     Err(e) => return Err(e),      // 出错就提前返回这个错误
        // }
        // TODO 如何控制 mint_tokens 只能由 spltokencpi 调用呢？
        spltoken::cpi::cpi_mint_tokens(ctx.accounts.to_cpi_ctx(), amount)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CpiMintTokens<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub to: Account<'info, TokenAccount>,
    pub mint_authority: Signer<'info>,
    pub token_program: Program<'info, Token>,
    pub spltoken_program: Program<'info, Spltoken>,

    /// CHECK: sysvar
    #[account(address = IX_ID)]
    pub ix_sysvar: AccountInfo<'info>,
}

impl<'info> CpiMintTokens<'info> {
    pub fn to_cpi_ctx(&self) -> CpiContext<'_, '_, '_, 'info, spltoken::cpi::accounts::MintTokens<'info>> {
        let cpi_program = self.spltoken_program.to_account_info();
        let cpi_accounts = spltoken::cpi::accounts::MintTokens {
            mint: self.mint.to_account_info(),
            to: self.to.to_account_info(),
            mint_authority: self.mint_authority.to_account_info(),
            token_program: self.token_program.to_account_info(),
            ix_sysvar: self.ix_sysvar.to_account_info(),
        };
        CpiContext::new(cpi_program, cpi_accounts)
    }
}
