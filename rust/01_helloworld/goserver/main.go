package main

import (
	"bufio"
	"context"
	"encoding/base64"
	"fmt"
	"os"
	"strings"

	"github.com/blocto/solana-go-sdk/client"
)

/*
*
TODO 签名上链，到确认，经过了哪些流程
*/
func main() {
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("请输入 base64 签名交易：")
	line, _ := reader.ReadString('\n')
	base64Tx := strings.TrimSpace(line)

	rawTx, err := base64.StdEncoding.DecodeString(base64Tx)
	if err != nil {
		fmt.Println("❌ Base64 解码失败:", err)
		return
	}

	c := client.NewClient("https://api.devnet.solana.com")
	txSig, err := c.SendRawTransaction(context.Background(), rawTx)
	if err != nil {
		fmt.Println("❌ 交易发送失败:", err)
		return
	}

	fmt.Println("✅ 交易发送成功! TxID:", txSig)
}
