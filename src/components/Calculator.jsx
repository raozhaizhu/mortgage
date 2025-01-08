// ./src/components/Calculator.jsx
import React, { useState } from 'react';

const Calculator = () => {
    const [results, setResults] = useState(null);
    const [amount, setAmount] = useState('');
    const [term, setTerm] = useState('');
    const [rate, setRate] = useState('');
    const [type, setType] = useState('repayment');
    const [formattedAmount, setFormattedAmount] = useState('');

    // 定义计算函数
    const calculateRepayment = (amount, term, rate, type) => {
        // 转换参数
        const p = amount; // 贷款金额
        const r = rate / 12 / 100; // 月利率
        const n = term * 12; // 总期数

        let monthlyPayment = 0;
        let totalRepayment = 0;
        if (type === 'repayment') {
            if (r === 0) {
                monthlyPayment = p / n;
                totalRepayment = p;
            } else {
                monthlyPayment = p * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
                totalRepayment = monthlyPayment * n;
            }
        } else if (type === 'interestOnly') {
            monthlyPayment = p * r;
            totalRepayment = p + monthlyPayment * n;
        }

        return { monthlyPayment, totalRepayment };
    };

    // 处理表单提交事件
    const handleSubmit = (e) => {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 添加输入验证
        if (!amount || !term || !rate) {
            alert('Please fill in all fields');
            return;
        }
        // 转换表单内容为数字
        const amountValue = parseFloat(amount);
        const termValue = parseInt(term);
        const rateValue = parseFloat(rate);
        // 添加输入类型验证(必须为数字,金额/期数必须大于0,利率必须大于等于0)
        if (amount <= 0 || term <= 0 || rate < 0) {
            alert('Please enter positive values for all fields');
            return;
        }

        // 获取计算结果
        const { monthlyPayment, totalRepayment } = calculateRepayment(amountValue, termValue, rateValue, type);
        // 更新状态
        setResults({ monthlyPayment, totalRepayment });
    };

    // 处理清空按钮点击事件
    const handleClear = () => {
        setResults(null);
        setAmount('');
        setFormattedAmount('');
        setTerm('');
        setRate('');
        setType('repayment');
    };

    // 格式化数字
    const formatNumber = (num) => {
        if (num === undefined || num === null) return '0.00';
        return Number(num)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 手动加上千分位
    };
    const handleAmountChange = (e) => {
        let inputValue = e.target.value;

        // 如果是删除操作，避免空字符串
        if (inputValue === '') {
            setAmount('');
            setFormattedAmount('');
            return;
        }

        // 仅允许输入数字、小数点和逗号
        inputValue = inputValue.replace(/[^0-9.]/g, '');

        // 分割整数和小数部分
        const [integerPart, decimalPart] = inputValue.split('.');

        // 正确格式化整数部分为千分位
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // 拼接小数部分
        const formattedValue = decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger;

        // 更新状态
        setAmount(inputValue);
        setFormattedAmount(formattedValue);
    };

    return (
        <div className='whole-page flex  justify-center items-center bg-[#e2f3fb] w-100 min-h-screen'>
            <div className='wrapper grid grid-cols-2 w-8/12 bg-[#ffffff] rounded-3xl  overflow-hidden'>
                <div className='calculator p-[2rem]'>
                    <div className='flex justify-between items-center mb-[1.5rem]'>
                        <h1 className='text-[1.2rem] font-bold text-[#0b212e]'>Mortgage Calculator</h1>
                        <a
                            className='text-[#4b6471] text-sm underline'
                            role='button'
                            tabIndex={0}
                            onClick={handleClear}
                            onKeyDown={(e) => {
                                e.key === 'Enter' && handleClear();
                            }}
                        >
                            Clear All
                        </a>
                    </div>
                    <form>
                        <div className='mortgageAmount flex flex-col gap-2 mb-[1rem]'>
                            <label htmlFor='mortgageAmount' className='text-[#62767e]'>
                                Mortgage Amount
                            </label>
                            <div className='mortgageAmountInput flex border border-[#818d94] rounded'>
                                <div className='sym bg-[#e3f4fc] text-[#4b6471] px-[1rem] py-[0.5rem] rounded-l'>$</div>
                                <input
                                    type='text'
                                    name='mortgageAmount'
                                    id='mortgageAmount'
                                    className='px-[1rem] py-[0.5rem] cursor-pointer'
                                    value={formattedAmount} // 显示格式化后的数字
                                    onChange={handleAmountChange} // 每次输入都重新计算
                                />
                            </div>
                        </div>

                        <div className='mortgageTermRate grid grid-cols-2 gap-4 mb-[1rem]'>
                            <div className='mortgageTerm flex flex-col gap-2'>
                                <label htmlFor='mortgageTerm' className='text-[#62767e]'>
                                    Mortgage Term
                                </label>
                                <div className='mortgageTermInput grid grid-cols-2 border border-[#818d94] rounded'>
                                    <input
                                        type='number'
                                        name='mortgageTerm'
                                        id='mortgageTerm'
                                        className='flex-1 px-[1rem] py-[0.5rem] border-l border-[#818d94] rounded cursor-pointer'
                                        value={term}
                                        onChange={(e) => setTerm(e.target.value)}
                                    />
                                    <div className='sym bg-[#e3f4fc] text-[#4b6471] px-[1rem] py-[0.5rem] rounded-r font-bold text-center'>
                                        years
                                    </div>
                                </div>
                            </div>

                            <div className='mortgageRate flex flex-col gap-2'>
                                <label htmlFor='mortgageRate' className='text-[#62767e]'>
                                    Mortgage Rate
                                </label>
                                <div className='mortgageRateInput grid grid-cols-2 border border-[#818d94] rounded'>
                                    <input
                                        type='number'
                                        name='mortgageRate'
                                        id='mortgageRate'
                                        className='flex-1 px-[1rem] py-[0.5rem] border-l border-[#818d94] rounded cursor-pointer'
                                        value={rate}
                                        onChange={(e) => setRate(e.target.value)}
                                    />
                                    <div className='sym bg-[#e3f4fc] text-[#4b6471] px-[1rem] py-[0.5rem] rounded-r font-bold text-center'>
                                        %
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='mortgageType flex flex-col gap-2 mb-[2rem] text-[#62767e]'>
                            <p>Mortgage Type</p>
                            <div className='repayment flex items-center border border-[#818d94]  text-[#4b6471] px-[1rem] py-[0.5rem] rounded '>
                                <input
                                    type='radio'
                                    name='mortgageType'
                                    value='repayment'
                                    id='repayment'
                                    checked={type === 'repayment'}
                                    onChange={() => setType('repayment')}
                                />
                                <label htmlFor='repayment' className='font-bold'>
                                    Repayment
                                </label>
                            </div>
                            <div className='repayment flex items-center border border-[#818d94]  text-[#4b6471] px-[1rem] py-[0.5rem] rounded '>
                                <input
                                    type='radio'
                                    name='mortgageType'
                                    value='interestOnly'
                                    id='interestOnly'
                                    checked={type === 'interestOnly'}
                                    onChange={() => setType('interestOnly')}
                                />
                                <label htmlFor='interestOnly' className='font-bold'>
                                    Interest Only
                                </label>
                            </div>
                        </div>

                        <div
                            className='inline-block bg-[#dada33] px-[1rem] py-[0.5rem] rounded-3xl font-bold text-[0.85rem]  cursor-pointer'
                            role='button'
                            tabIndex={0}
                            onClick={handleSubmit}
                            onKeyDown={(e) => {
                                e.key === 'Enter' && handleSubmit();
                            }}
                        >
                            <img src='/icon-calculator.svg' className='inline mr-[0.5rem] scale-[0.85] align-middle' />
                            Calculate Repayments
                        </div>
                    </form>
                </div>

                <div className='results flex flex-col justify-center items-center p-[2rem] bg-[#133040] text-white rounded-bl-[5rem]'>
                    {!results ? (
                        <div className='default-result flex flex-col gap-2 justify-center items-center'>
                            <img src='/illustration-empty.svg' alt='empty illustration' className='mx-auto w-1/2' />
                            <h2 className='text-[1.2rem] font-bold'>Results shown here</h2>
                            <p className='text-center text-[0.85rem] opacity-[0.7]'>
                                Complete the form and click “calculate repayments” to see what your monthly repayments
                                would be.
                            </p>
                        </div>
                    ) : (
                        <div className='calculator-result'>
                            <div>
                                <h2 className='text-[1.2rem] font-bold mb-[1rem]'>Your results</h2>
                                <p className='text-[0.85rem] opacity-[0.7] mb-[2rem]'>
                                    Your results are shown below based on the information you provided. To adjust the
                                    results, edit the form and click “calculate repayments” again.{' '}
                                </p>
                            </div>
                            <div className='pt-1 bg-[#d5dc47] rounded-lg'>
                                <div className='flex flex-col gap-[1rem] bg-[#0e2431] p-[1.5rem] rounded'>
                                    <div>
                                        <p className='text-[0.85rem] opacity-[0.7]'>Your monthly repayments</p>
                                        <h3 className='text-[3rem] font-bold text-[#d5dc47] mt-[0.5rem]'>
                                            {results ? formatNumber(results.monthlyPayment) : '0.00'}
                                        </h3>
                                    </div>

                                    <hr />
                                    <div>
                                        <p className='text-[0.85rem] opacity-[0.7]'>
                                            Total you will repay over the term
                                        </p>
                                        <h4 className='text-[1.2rem] font-bold mt-[0.5rem]'>
                                            {results ? formatNumber(results.totalRepayment) : '0.00'}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calculator;

