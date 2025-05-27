use anchor_lang::prelude::*;

declare_id!("3dcedJWgjG8aDroaVHJK4AYv9Aa1B9mVBx8VLhN66CgP");

#[program]
pub mod helloworld {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, message:String) -> Result<()> {
        ctx.accounts.message_account.message = message;
        Ok(())
    }

    pub fn set_message(ctx:Context<SetMessage>, message:String) -> Result<()> {
        ctx.accounts.message_account.message = message;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer=user,
        space=8 + 4 + 280,
        seeds = [b"message", user.key().as_ref()],
        bump,
    )]
    pub message_account:Account<'info, MessageAccount>,
    #[account(mut)]
    pub user:Signer<'info>,
    pub system_program:Program<'info, System>
}

#[derive(Accounts)]
pub struct SetMessage<'info> {
    #[account(mut)]
    pub message_account:Account<'info, MessageAccount>,
}
#[account]
pub struct MessageAccount {
    pub message: String,
}