module goserver

go 1.22.0

require github.com/blocto/solana-go-sdk v0.0.0-00010101000000-000000000000

replace github.com/blocto/solana-go-sdk => ./solana-go-sdk

require (
	filippo.io/edwards25519 v1.0.0-rc.1 // indirect
	github.com/mr-tron/base58 v1.2.0 // indirect
	github.com/stretchr/testify v1.9.0 // indirect
)
