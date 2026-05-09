---
title: 判断抑郁症程度的 metrics.py 文件解答
publishDate: 2026-05-09
---

> 原项目网址：https://adodas.hai-lab.cn/
> 由于我很弱，导致没有进组，因而拿不到数据集了，就算能拿到也没有足够的算力进行测试，以下内容均为 ChatGPT 5.5 给我的解答（貌似是来源于github官方项目上baseline中的算法），无法验证对错及准确率，主要用于学习核心思想与函数。

全文使用 numpy 库，或许后续添加 pytorch 版本

```python
import numpy as np
```

---

Sigmoid 函数：不管输入给模型多大多小的数字（比如 -10000 或者是 99999），Sigmoid 函数的**作用**就是把这些数字“挤压”到 **0 和 1 之间**
为什么要“挤压”：如果输入的数字特别小（比如 -1000），计算出来的结果会逼近无穷大或极小的值，超出了计算机的存储极限，Python 就会直接报错退出（数值溢出）

> 很经典的 sigmoid 函数，学过逻辑回归就知道，必备的分类函数。

```python
def sigmoid(values: np.ndarray) -> np.ndarray: # N-dimensional array（N维数组）
	# 把 values 里面所有小于 -40 的数字强行变成 -40，把所有大于 40 的数字强行变成 40。中间的数字保持不变
    clipped = np.clip(values, -40.0, 40.0)
    # 限制在 -40 到 40 之间，对最后算出来的 0 到 1 的概率结果影响微乎其微，但能保护程序稳定运行
    return 1.0 / (1.0 + np.exp(-clipped))
```

Sigmoid 函数：

$$
\sigma(z) = \frac{1}{1 + e^{-z}}
$$

所用函数：
1. np.clip(a, a_min, a_max, out=None)：挤压
- a: 输入的nd.array
- a_min/a_max: 设定的下界/上界
- out[可选项]: 将处理后的矩阵存放在out中指定的矩阵中， 注意存放的矩阵尺寸要相同
2. np.exp(n)：返回 $e$ 的 n 次方

---

F1 score； true: 标准答案； prob: 模型预测概率； threshold: 阈值（及格线）

> 仍然为逻辑回归的知识，F1 分数是常用的评估指标之一

```python
def binary_f1(y_true: np.ndarray, y_prob: np.ndarray, threshold: float = 0.5) -> float:
    y_pred = (y_prob >= threshold).astype(int) # true = 1, false = 0
    # 混淆矩阵，将结果相加后取小数后计算
    tp = float(np.sum((y_true == 1) & (y_pred == 1))) # 对了
    fp = float(np.sum((y_true == 0) & (y_pred == 1))) # 错了
    fn = float(np.sum((y_true == 1) & (y_pred == 0))) # 漏了
    denominator = 2.0 * tp + fp + fn # denominator（分母）
    if denominator == 0.0:
        return 0.0   
    return (2.0 * tp) / denominator # F1 score 定义式
```

F1 分数：

$$
\frac{2 \cdot P \cdot R}{P+R}
$$

所用函数：
1. np.sum()：求和	$∑$

---

AUC (Area Under Curve)：专门用于评估二分类模型（只做非黑即白判断的模型，比如“是/否”）

> 分类问题最常用的指标之一

```python
def binary_auc(y_true: np.ndarray, y_prob: np.ndarray) -> float:
    positives = np.sum(y_true == 1) # 标准答案中的正例
    negatives = np.sum(y_true == 0) # 标准答案中的负例
    if positives == 0 or negatives == 0: # 标准答案全正或全负，无意义
        return 0.5
    # 按预测概率升序排序
    order = np.argsort(y_prob)
    # 取出排序后的标签
    sorted_labels = y_true[order]
    # 构造名次，从 1 开始更方便代入公式
    ranks = np.arange(1, len(sorted_labels) + 1)
    # 正样本名次之和
    positive_rank_sum = np.sum(ranks[sorted_labels == 1])
    auc = (positive_rank_sum - positives * (positives + 1) / 2.0) / (positives * negatives) # AUC 定义式（Mann-Whitney U 检验法）
    return float(auc)
```

所用函数：
1. np.argsort():升序排序数组元素
2. numpy.arange(start, stop, step, dtype = None)：生成数组
- start[可选项]：开始位置，默认起始值为0
- stop：停止位置
- step[可选项]：步，默认步为1，如果指定了step，则**必须给出start**
- dtype：输出数组的类型。如果未给出dtype，则从其他输入参数推断数据类型

---

计算 Track A1 的主指标和辅指标。

```python
def evaluate_a1(y_true: np.ndarray, y_prob: np.ndarray) -> dict[str, float]: # 返回字典
    f1_scores = [binary_f1(y_true[:, index], y_prob[:, index]) for index in range(3)] # F1 score
    auc_scores = [binary_auc(y_true[:, index], y_prob[:, index]) for index in range(3)] # AUC
    return {
        "f1_depression": float(f1_scores[0]),
        "f1_anxiety": float(f1_scores[1]),
        "f1_stress": float(f1_scores[2]),
        "mean_f1": float(np.mean(f1_scores)),  # 平均值
        "auc_depression": float(auc_scores[0]),
        "auc_anxiety": float(auc_scores[1]),
        "auc_stress": float(auc_scores[2]),
        "mean_auc": float(np.mean(auc_scores)),
    }
```

所用函数：
1. np.mean()：计算平均值

---

二次加权 Kappa (QWK：Quadratic Weighted Kappa)

> 评分任务，严重程度。区别于 F1 分数 的单纯二分任务，引入惩罚权重

```python
def quadratic_weighted_kappa(y_true: np.ndarray, y_pred: np.ndarray, num_classes: int = 4) -> float:
    observed = np.zeros((num_classes, num_classes), dtype=float) # 4x4 的零矩阵
    # 混淆矩阵：比如标准答案是 1，模型猜了 2，就在表格第 1 行、第 2 列的格子里加 1
    for truth, pred in zip(y_true.astype(int), y_pred.astype(int)):
        observed[truth, pred] += 1.0
    # 建立“期望矩阵”
    true_hist = np.sum(observed, axis=1)
    pred_hist = np.sum(observed, axis=0)
    expected = np.outer(true_hist, pred_hist)
    if expected.sum() == 0:
        return 0.0
    expected = expected / expected.sum() * observed.sum()
    # 建立“惩罚权重矩阵”
    weights = np.zeros((num_classes, num_classes), dtype=float)
    for i in range(num_classes):
        for j in range(num_classes):
            weights[i, j] = ((i - j) ** 2) / float((num_classes - 1) ** 2) # 二次加权的数学定义
    # 计算最终得分
    numerator = float(np.sum(weights * observed)) # 分子：模型实际犯了多少错
    denominator = float(np.sum(weights * expected)) # 分母：随机猜会错多少
    if denominator == 0.0:
        return 1.0 
    return 1.0 - numerator / denominator # QWK公式
```

所用函数：
1. np.outer(a, b)：计算两个向量的外积（矩阵乘法），返回一个矩阵
2. np.zeros(shape ,dtype=float, order='C')：返回一个元素全为0且给定形状和类型的数组
- shape:形状
- dtype:数据类型，可选参数，默认numpy.float64
- order[可选项]:‘c’ 代表与c语言类似，行优先;‘F’代表列优先

---

计算 Track A2 的主指标和辅指标。

```python
def evaluate_a2(y_true: np.ndarray, y_pred: np.ndarray) -> dict[str, float]:
    qwk_scores: list[float] = []
    mae_scores: list[float] = []
    # 逐列计算。
    for column_index in range(y_true.shape[1]):
        qwk_scores.append(
            quadratic_weighted_kappa(y_true[:, column_index], y_pred[:, column_index]) # QWK
        )
        mae_scores.append(
            float(np.mean(np.abs(y_true[:, column_index] - y_pred[:, column_index]))) # MAE (平均绝对误差, Mean Absolute Error)
        )
    return {
        "mean_qwk": float(np.mean(qwk_scores)),
        "mean_mae": float(np.mean(mae_scores)),
    }
```

---

全部的 Python 代码如下：
```python
'''
已阅读完成, 有一个？？？
'''
import numpy as np

#  Sigmoid 函数（S型函数）不管输入给模型多大多小的数字（比如 -10000 或者是 99999），Sigmoid 函数的作用就是把这些数字强行“挤压”到 0 和 1 之间
#  如果输入的数字特别小（比如 -1000），计算出来的结果会逼近无穷大或极小值，超出了计算机的存储极限，Python 就会直接报错退出（数值溢出）
def sigmoid(values: np.ndarray) -> np.ndarray:  # N-dimensional array（N维数组）
    clipped = np.clip(values, -40.0, 40.0)  # 把 values 里面所有小于 -40 的数字强行变成 -40，把所有大于 40 的数字强行变成 40。中间的数字保持不变
    # 限制在 -40 到 40 之间，对最后算出来的 0 到 1 的概率结果影响微乎其微，但能保护程序稳定运行
    return 1.0 / (1.0 + np.exp(-clipped))

# F1 score, true: 标准答案, prob: 模型预测概率, threshold: 阈值（及格线）
def binary_f1(y_true: np.ndarray, y_prob: np.ndarray, threshold: float = 0.5) -> float:
    y_pred = (y_prob >= threshold).astype(int) # true = 1, false = 0
    # 混淆矩阵，将结果相加后取小数后计算
    tp = float(np.sum((y_true == 1) & (y_pred == 1))) # 对了
    fp = float(np.sum((y_true == 0) & (y_pred == 1))) # 错了
    fn = float(np.sum((y_true == 1) & (y_pred == 0))) # 漏了
    denominator = 2.0 * tp + fp + fn # denominator（分母）
    if denominator == 0.0:
        return 0.0   
    return (2.0 * tp) / denominator # F1 score 定义式

# AUC (Area Under Curve)，专门用于评估二分类模型（只做非黑即白判断的模型，比如“是/否”）
def binary_auc(y_true: np.ndarray, y_prob: np.ndarray) -> float:
    positives = np.sum(y_true == 1) # 标准答案中的正例
    negatives = np.sum(y_true == 0) # 标准答案中的负例
    if positives == 0 or negatives == 0: # 标准答案全正或全负，无意义
        return 0.5
    # 按预测概率升序排序
    order = np.argsort(y_prob)
    # 取出排序后的标签。
    sorted_labels = y_true[order]
    # 构造名次，从 1 开始更方便代入公式
    ranks = np.arange(1, len(sorted_labels) + 1)
    # 正样本名次之和
    positive_rank_sum = np.sum(ranks[sorted_labels == 1])
    auc = (positive_rank_sum - positives * (positives + 1) / 2.0) / (positives * negatives) # AUC 定义式（Mann-Whitney U 检验法）
    return float(auc)

# 计算 Track A1 的主指标和辅指标。
def evaluate_a1(y_true: np.ndarray, y_prob: np.ndarray) -> dict[str, float]: # 返回字典
    f1_scores = [binary_f1(y_true[:, index], y_prob[:, index]) for index in range(3)] # F1 score
    auc_scores = [binary_auc(y_true[:, index], y_prob[:, index]) for index in range(3)] # AUC
    return {
        "f1_depression": float(f1_scores[0]),
        "f1_anxiety": float(f1_scores[1]),
        "f1_stress": float(f1_scores[2]),
        "mean_f1": float(np.mean(f1_scores)),  # 平均值
        "auc_depression": float(auc_scores[0]),
        "auc_anxiety": float(auc_scores[1]),
        "auc_stress": float(auc_scores[2]),
        "mean_auc": float(np.mean(auc_scores)),
    }

# F1 和 AUC 主要处理的是“非黑即白”的二分类（比如：是不是病）。
# 如果在 A2 任务中，你需要判断的是严重程度（比如：0=没病，1=轻度，2=中度，3=重度），普通的准确率就不管用了。

# 二次加权 Kappa (Quadratic Weighted Kappa, 简称 QWK)
def quadratic_weighted_kappa(y_true: np.ndarray, y_pred: np.ndarray, num_classes: int = 4) -> float:
    observed = np.zeros((num_classes, num_classes), dtype=float) # 4x4 的零矩阵
    # 混淆矩阵：比如标准答案是 1，模型猜了 2，就在表格第 1 行、第 2 列的格子里加 1
    for truth, pred in zip(y_true.astype(int), y_pred.astype(int)):
        observed[truth, pred] += 1.0
    # 建立“期望矩阵”
    true_hist = np.sum(observed, axis=1)
    pred_hist = np.sum(observed, axis=0)
    expected = np.outer(true_hist, pred_hist)
    if expected.sum() == 0:
        return 0.0
    expected = expected / expected.sum() * observed.sum()
    # 建立“惩罚权重矩阵”
    weights = np.zeros((num_classes, num_classes), dtype=float)
    for i in range(num_classes):
        for j in range(num_classes):
            weights[i, j] = ((i - j) ** 2) / float((num_classes - 1) ** 2) # 二次加权的数学定义
    # 计算最终得分
    numerator = float(np.sum(weights * observed)) # 分子：模型实际犯了多少错
    denominator = float(np.sum(weights * expected)) # 分母：随机猜会错多少
    if denominator == 0.0:
        return 1.0 
    return 1.0 - numerator / denominator # QWK公式

# 计算 Track A2 的主指标和辅指标。
def evaluate_a2(y_true: np.ndarray, y_pred: np.ndarray) -> dict[str, float]:
    qwk_scores: list[float] = []
    mae_scores: list[float] = []
    # 逐列计算。
    for column_index in range(y_true.shape[1]):
        qwk_scores.append(
            quadratic_weighted_kappa(y_true[:, column_index], y_pred[:, column_index]) # QWK
        )
        mae_scores.append(
            float(np.mean(np.abs(y_true[:, column_index] - y_pred[:, column_index]))) # MAE (平均绝对误差, Mean Absolute Error)
        )
    return {
        "mean_qwk": float(np.mean(qwk_scores)),
        "mean_mae": float(np.mean(mae_scores)),
    }
```
