Component({
  properties: {
    number_keybord_show: { type: Boolean, value: false },
    modalTran: { type: String, value: '0' },
    number_keybord_position: { type: String, value: "-760" },
    confirmText: { type: String, value: 'OK' },
    value: {
      type: String,
      value: ''
    }
  },
  attached() {
  },
  methods: {
    openKeyPad() {
      this.setData({
        number_keybord_show: true,
        modalTran: '0.45',
        value: ""
      });
      setTimeout(() => {
        this.setData({
          number_keybord_position: "-2"
        });
      }, 100);
    },
    // 点击数字按钮
    appendNumber(event: any) {
      const number = event.currentTarget.dataset.number;
      let newValue = this.data.value + number;
      // 判断小数点后是否已经有两位数字，如果是，则不再添加
      if (newValue.includes('.')) {
        const decimalPart = newValue.split('.')[1]; // 获取小数点后部分
        if (decimalPart.length > 2) {
          // 如果小数点后已经有两位数，则不再添加数字
          return;
        }
      }
      // 更新数据
      this.setData({
        value: newValue
      });
    },
    // 点击运算符
    appendOperator(event: any) {
      const operator = event.currentTarget.dataset.operator;
      // 清空按钮
      if (operator === 'C') {
        this.setData({
          value: "",
          confirmText: 'OK'
        })
        return
      };
      // 防止在字符串开始时输入加号或减号
      if (this.data.value === '' && operator !== '-') return;
      // 防止输入多个连续的加号或减号
      if (this.data.value.endsWith('+') || this.data.value.endsWith('-')) return;
      this.setData({
        value: this.data.value + operator
      });
      this.updateConfirmText()
    },
    delNumber() {
      this.setData({
        value: this.data.value.slice(0, -1)
      });
      this.updateConfirmText()
    },
    // 实时更新按钮文本
    updateConfirmText() {
      let price_copy = this.data.value.split('');
      if (price_copy[0] == '-') {
        price_copy.shift()
      }
      const operators = ['+', '-', '*', '/'];  // 运算符列表
      const containsOperator = operators.some(op => price_copy.includes(op)); // 判断是否包含运算符
      if (containsOperator) {
        // 如果包含运算符，显示 "="
        this.setData({
          confirmText: '='
        });
      } else {
        // 否则显示 "OK"
        this.setData({
          confirmText: 'OK'
        });
      }
    },
    // 点击小数点按钮
    appendDecimal() {
      // 防止多个小数点
      if (this.data.value.includes('.')) return;
      this.setData({
        value: this.data.value + '.'
      });
    },
    // 点击价格
    priceTap() { },
    // 确认输入
    confirmInput() {
      if (this.data.confirmText === '=') {
        this.setData({
          value: this.calculateExpression(this.data.value),
          confirmText: "OK"
        })
      } else {
        this.closeKeybord()
        wx.navigateTo({
          url: '/pages/records/records?amount=' + this.data.value
        })
      }
    },
    closeKeybord() {
      this.setData({
        "number_keybord_position": -760,
        "modalTran": 0
      })
      setTimeout(() => {
        this.setData({ "number_keybord_show": false })
      }, 100);
    },
    calculateExpression(expression: String) {
      // 去除多余的空格
      expression = expression.replace(/\s+/g, '');
      // 如果表达式为空，返回 0
      if (expression === '') return 0;
      // 先处理乘法和除法
      let mulDivResult = [];
      let i = 0;
      let currentNumber = 0;
      let currentOperator = '+';
      // 遍历表达式并处理乘除法
      while (i < expression.length) {
        const char = expression.charAt(i);
        if (/\d/.test(char)) {
          // 累积当前数字
          currentNumber = currentNumber * 10 + parseInt(char, 10);
        }
        // 如果遇到运算符或字符串结束
        if (['+', '-', '*', '/', i === expression.length - 1].includes(char) || i === expression.length - 1) {
          if (currentOperator === '+') {
            mulDivResult.push(currentNumber); // 加法，直接存入数组
          } else if (currentOperator === '-') {
            mulDivResult.push(-currentNumber); // 减法，存入负数
          } else if (currentOperator === '*') {
            mulDivResult[mulDivResult.length - 1] *= currentNumber; // 乘法，更新前一个数值
          } else if (currentOperator === '/') {
            if (currentNumber === 0) {
              throw new Error("Division by zero error!");
            }
            mulDivResult[mulDivResult.length - 1] /= currentNumber; // 除法，更新前一个数值
          }
          // 更新当前操作符，并重置当前数字
          if (char === '+' || char === '-' || char === '*' || char === '/') {
            currentOperator = char;
          }
          currentNumber = 0;  // 重置数字
        }
        i++;
      }
      // 对加法和减法的结果求和
      return mulDivResult.reduce((acc, num) => acc + num, 0);
    }

  }
});
