---
title: 01. 线性回归
publishDate: 2026-05-05
---

## 1.1 单自变量线性回归模型

$$
\hat{y} = w x + b
$$

- $x$：自变量（输入特征）
- $\hat{y}$：模型的预测值（戴帽子表示预测）
- $w$：斜率（权重）
- $b$：截距（截距）

**显然可知，样本数据是二维直角坐标图像上的一群点，我们通过选取不同的 $w$ 和 $b$ ，使得模拟出的直线，要让尽量多的点在直线上和周围。**

---
## 1.2 代价函数：预测值 $\hat{y}$ 和真实值 $y$ 的差距

**通过计算 $\hat{y}_i - y_i$ 再取平方，可以显而易见的得到预测值与真实值的差，求和后除以样本总量，得到代价函数的值。代价函数越趋于0越好。**

**均方误差 (Mean Squared Error, MSE)**：

$$
J(\mathbf{w, b}) = \frac{1}{2m} \sum_{i=1}^{m} (\hat{y}_i - y_i)^2
$$

- $m$：样本数量
- $\hat{y}$：模型的预测值
- $y$：真实值

**为什么是1/2m？：我也不知道，吴恩达老师就是用的2m，可以是m吗？当然可以！**
> 补充：经观察，取2m时求梯度的分子系数为1，貌似更简洁

---
## 1.3 参数求解

**如何得到 $w$ 和 $b$ 使得代价函数 $J(\mathbf{w, b})$ 处于极小值呢？**

### 梯度下降 (Gradient Descent)

同时更新 $w$ 和 $b$ ，**严禁更改下面的顺序**（如果先算 $w$ 后直接更新它，将会导致 $b$ 有问题）：

$$
tmp\_w = w - \alpha \frac{\partial}{\partial w} J(w,b)
$$

$$
tmp\_b = b - \alpha \frac{\partial}{\partial b} J(w,b)
$$

$$
w = tmp\_w
$$

$$
b = tmp\_b
$$

- $\frac{\partial}{\partial w} J(w,b)$：函数对 $w$ 求偏导。$w$ 导， $b$ 看作常量
- $\frac{\partial}{\partial b} J(w,b)$：对 $b$ 求偏导
- $\alpha$：学习率 (learning rate)，控制每一步走多远

> =是Python赋值语句而不是数学中的判断，作判断是==

> 都叫梯度了，所以这里是偏导数，但吴恩达老师在这里要叫他导数...never mind

**$\alpha$太大：导致震荡甚至发散；学习率太小则收敛非常慢。**

**当位于代价函数极小值时，梯度为0，因而此时 $w$ 和 $b$ 均不再更新**

---
## 1.4 数学推导

$$
\frac{\partial}{\partial w} J(w,b) = \frac{\partial}{\partial w} \frac{1}{2m} \sum_{i=1}^{m} \left( f_{w,b}(x^{(i)}) - y^{(i)} \right)^2 = \frac{\partial}{\partial w} \frac{1}{2m} \sum_{i=1}^{m} \left( wx^{(i)} + b - y^{(i)} \right)^2
$$

$$
= \frac{1}{2m} \sum_{i=1}^{m} \left( wx^{(i)} + b - y^{(i)} \right) \cdot 2 \cdot x^{(i)} = \frac{1}{m} \sum_{i=1}^{m} \left( f_{w,b}(x^{(i)}) - y^{(i)} \right) x^{(i)}
$$

$$
\frac{\partial}{\partial b} J(w,b) = \frac{\partial}{\partial b} \frac{1}{2m} \sum_{i=1}^{m} \left( f_{w,b}(x^{(i)}) - y^{(i)} \right)^2 = \frac{\partial}{\partial b} \frac{1}{2m} \sum_{i=1}^{m} \left( wx^{(i)} + b - y^{(i)} \right)^2
$$

$$
= \frac{1}{2m} \sum_{i=1}^{m} \left( wx^{(i)} + b - y^{(i)} \right) \cdot 2 = \frac{1}{m} \sum_{i=1}^{m} \left( f_{w,b}(x^{(i)}) - y^{(i)} \right)
$$

> 注意：对 $w$ 求偏导相较于对 $b$ 求偏导，后面跟着一个 $x^{(i)}$

**总公式：**

$$
w = w - \alpha \frac{1}{m} \sum_{i=1}^{m} \left( f_{w,b}(x^{(i)}) - y^{(i)} \right) x^{(i)}
$$

$$
b = b - \alpha \frac{1}{m} \sum_{i=1}^{m} \left( f_{w,b}(x^{(i)}) - y^{(i)} \right)
$$

---

## 1.5 多元线性回归

$$
f_{w,b}(x) = w_1 x_1 + w_2 x_2 + \cdots + w_n x_n + b
$$

事实上，抛开数字 $b$ ，可以发现是本质上是 $w_i$ 与 $x_i$ 两个向量的点乘，即：

$$
f_{\vec{w},b}(\vec{x}) = \vec{w} \cdot \vec{x} + b
$$

如果需要计算此时在某点的函数值（预测值），则显然需要for循环从 0 到 n（实际上是到 n-1，因为公式下标从 1 开始，但Python语言中下标从 0 开始）

**很慢！** for循环遍历的时间复杂度为 $O(n)$

如何高效？numpy自带语法：`f = np.dot(w,x) + b`

> 打个比方，for 循环为单核，np.dot 为多核迸发，所以快

---

## 1.6 多元线性回归的梯度下降

$$
w_1 = w_1 - \alpha \frac{1}{m} \sum_{i=1}^{m} \left( f_{\vec{w},b}(\vec{x}^{(i)}) - y^{(i)} \right) x_1^{(i)}
$$

$$
\vdots
$$

$$
w_n = w_n - \alpha \frac{1}{m} \sum_{i=1}^{m} \left( f_{\vec{w},b}(\vec{x}^{(i)}) - y^{(i)} \right) x_n^{(i)}
$$

$$
b = b - \alpha \frac{1}{m} \sum_{i=1}^{m} \left( f_{\vec{w},b}(\vec{x}^{(i)}) - y^{(i)} \right)
$$

可以看出 the same as before，上标看第几个样本，下标看第几个特征

---

## 1.7 特征缩放

梯度下降法对特征的数值范围非常敏感。如果特征的范围不一致，梯度的大小会差异很大，导致权重更新时"步子"不均匀，有的特征更新快，有的慢，模型可能需要更多迭代才能收敛，甚至可能无法收敛

### 最小-最大 归一化（Min-Max Normalization）

此算法的范围是 $[0, 1]$ 或者 $[-1, 1]$

$$x' = \frac{x - x_{min}}{x_{max} - x_{min}}$$

### 标准化（Standardization, Z - Score Scaling）

$$X' = \frac{X - \mu}{\sigma}$$

这里 $X$ 是原始特征值，$\mu$ 是该特征的均值，$\sigma$ 是标准差

---

## 1.8 代码实现

```python
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(0) # 设置随机种子
X = np.random.rand(100, 1) # 100个样本，一个特征
y = 2 * X + np.random.rand(100, 1) * 0.6 # 生成随机点（高斯噪声？）

w = np.random.randn()
b = np.random.randn()
lr = 0.01 # 学习率

# 损失函数：均方误差
def compute_loss(y_pred, y_true):
    return np.mean((y_pred - y_true) ** 2) # 等价于求和后除以样本量，因而没有 1/m

# 预测函数
def predict(X):
    return w * X + b

# 梯度计算，直到收敛
def compute_gradients(X, y, y_pred):
    m = len(X)  # 样本数量
    # 因为用了 np.mean，所以均方误差系数是 1/m 而不是 1/2m，因此求梯度时系数为 2/m
    dw = (2 / m) * np.sum((y_pred - y) * X)  # 对w的梯度
    db = (2 / m) * np.sum(y_pred - y)        # 对b的梯度
    return dw, db

# 训练模型
epochs = 3000  # 迭代次数
for epoch in range(epochs):
    y_pred = predict(X)  # 预测的y数值
    loss = compute_loss(y_pred, y)  # 损失
    dw, db = compute_gradients(X, y, y_pred)  # 梯度

    # 更新 w, b
    w -= lr * dw
    b -= lr * db

    # 每100次打印一次参数
    if epoch % 100 == 0:
        print(f"当前迭代 {epoch}：Loss = {loss}, w = {w}, b = {b}")

# 可视化
plt.scatter(X, y, label='Data')
plt.plot(X, predict(X), color='red', label='Fitted Line')
plt.legend()
plt.title("Simple Linear Regression")
plt.xlabel("x")
plt.ylabel("y")
plt.show()
```
