use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("AF1qD7iXg1531TcDjoDCbzj9L4jx6z5po2zZ4ixGb686");

#[program]
pub mod lock {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, unlock_time: i64) -> Result<()> {
        // TODO Clock::get()?.unix_timestamp 毫秒还是秒？ 时间从哪儿来的呢？
        require!(unlock_time > Clock::get()?.unix_timestamp, LockError::UnlockTimeInPast);

        let state = &mut ctx.accounts.state;
        state.owner = ctx.accounts.owner.key();
        state.unlock_time = unlock_time;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount:u64) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let state = &ctx.accounts.state;

        require!(now >= state.unlock_time, LockError::NotUnlocked);
        require!(ctx.accounts.owner.key() == state.owner, LockError::Unauthorized);

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.vault.to_account_info().clone(),
                to: ctx.accounts.owner.to_account_info().clone(),
            },
        );
        system_program::transfer(cpi_context, amount)?;

        // **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= amount;
        // **ctx.accounts.owner.try_borrow_mut_lamports()? += amount;

        emit!(WithdrawEvent {
            amount: amount,
            time: now,
        });

        Ok(())
    }

    pub fn deposit(ctx:Context<Deposit>, amount:u64) -> Result<()> {
        let now = Clock::get()?.unix_timestamp;
        let state = &ctx.accounts.state;
        require!(ctx.accounts.owner.key() == state.owner, LockError::Unauthorized);

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.owner.to_account_info().clone(),
                to: ctx.accounts.vault.to_account_info().clone(),
            },
        );
        system_program::transfer(cpi_context, amount)?;

        // **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? += amount;
        // **ctx.accounts.owner.try_borrow_mut_lamports()? -= amount;

        emit!(WithdrawEvent {
            amount: amount,
            time: now,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer=owner,
        space = 8 + 32 + 8,
        seeds = [b"state", owner.key().as_ref()],
        bump
    )]
    pub state:Account<'info, State>,

    /// CHECK: PDA vault to hold SOL
    #[account(
        init,
        payer = owner,
        space = 8,
        seeds = [b"vault", owner.key().as_ref()],
        bump
    )]
    pub vault:AccountInfo<'info>,
    #[account(mut)]
    pub owner:Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, seeds = [b"state", owner.key().as_ref()], bump)]
    pub state: Account<'info, State>,

    /// CHECK: Vault PDA
    #[account(
        mut,
        seeds = [b"vault", owner.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,

    // TODO System 是什么意思？
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut, seeds = [b"state", owner.key().as_ref()], bump)]
    pub state: Account<'info, State>,

    /// CHECK: Vault PDA
    #[account(
        mut,
        seeds = [b"vault", owner.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[event]
pub struct WithdrawEvent {
    pub amount: u64,
    pub time: i64,
}

#[event]
pub struct DepositEvent {
    pub amount: u64,
    pub time: i64,
}

#[account]
pub struct State {
    pub owner:Pubkey,
    pub unlock_time:i64,
}

#[error_code]
pub enum LockError {
    #[msg("Unlock time must be in the future")]
    UnlockTimeInPast,
    #[msg("You can't withdraw yet")]
    NotUnlocked,
    #[msg("You aren't the owner")]
    Unauthorized,
}