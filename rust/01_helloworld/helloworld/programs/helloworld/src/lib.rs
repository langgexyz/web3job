use anchor_lang::prelude::*;

declare_id!("8rXyiVRE32hi9d8PTxjNavGo2doakmBpvry82AXZrsVd");

#[program]
pub mod helloworld {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
