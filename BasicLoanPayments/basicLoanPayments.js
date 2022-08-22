import {
    Role, Party, ada, ConstantParam, AddValue, Deposit, Close, Pay, When, Case, TimeParam, Contract
} from 'marlowe-js';

(function () : Contract {
    const lender = Role("Lender")
    const borrower = Role("Borrower")
    const loanAmount = ConstantParam("LoanAmount")
    const interest = ConstantParam("Interest")
    const paybackDeadline = TimeParam("PaybackTimeout")
    const depositDeadline = TimeParam("DepositDeadline")

    function pay (payer, payee, token, amount, continuation) {
        return Pay(payer, payee, token, amount, continuation)
    }

    function deposit(payer, payee, token, amount, interest_amount) {
        return Deposit(payer, payee, token, AddValue( amount, interest_amount))
    }

    function payback (payer, payee, token, amount, interest_amount, deadline, continuation) {
        return When(
                [Case(
                    deposit(payer, payer, token, amount, interest_amount),
                    pay(
                        payer,
                        Party(payee),
                        token,
                        AddValue(
                            amount,
                            interest_amount
                        ), Close
                    )
                )],
                deadline, continuation)
    }

    return When([Case(Deposit(lender, lender, ada, loanAmount),
        pay(
            lender,
            Party(borrower),
            ada,
            loanAmount,
            payback(borrower, lender, ada, loanAmount, interest, paybackDeadline, Close)
        )
    )], depositDeadline, Close)
})