# 设置输出目录
BIN_DIR := bin

# 定义构建目标和源码路径
CHECKDEPLOY_SRC := checkdeploy/checkdeploy.go
CHECKMETA_SRC   := checkmeta/checkmeta.go

CHECKDEPLOY_BIN := $(BIN_DIR)/checkdeploy
CHECKMETA_BIN   := $(BIN_DIR)/checkmeta

.PHONY: all clean build checkdeploy checkmeta

# 默认构建所有目标
all: build

# 构建所有
build: checkdeploy checkmeta

# 构建 checkdeploy
checkdeploy:
	@mkdir -p $(BIN_DIR)
	go build -o $(CHECKDEPLOY_BIN) $(CHECKDEPLOY_SRC)

# 构建 checkmeta
checkmeta:
	@mkdir -p $(BIN_DIR)
	go build -o $(CHECKMETA_BIN) $(CHECKMETA_SRC)

# 清理构建产物
clean:
	rm -rf $(BIN_DIR)
