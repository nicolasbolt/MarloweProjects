import {
    PK, Role, Account, Party, ada, AvailableMoney, Constant, ConstantParam,
    NegValue, AddValue, SubValue, MulValue, DivValue, ChoiceValue, TimeIntervalStart,
    TimeIntervalEnd, UseValue, Cond, AndObs, OrObs, NotObs, ChoseSomething,
    ValueGE, ValueGT, ValueLT, ValueLE, ValueEQ, TrueObs, FalseObs, Deposit,
    Choice, Notify, Close, Pay, If, When, Let, Assert, SomeNumber, AccountId,
    ChoiceId, Token, ValueId, Value, EValue, Observation, Bound, Action, Payee,
    Case, Timeout, ETimeout, TimeParam, Contract
} from 'marlowe-js';

(function (): Contract {
    const bank = Role("Bank")
    const funder = Role("Funder")
    const payee = Role("Payee")

    const funderDeposit = ConstantParam("FunderDeposit")

    const funderDepositDeadline = TimeParam("FunderDepositDeadline")
    const firstPayoutWindow = TimeParam("FirstPayoutWindow")
    const secondPayoutWindow = TimeParam("SecondPayoutWindow")
    const thirdPayoutWindow = TimeParam("ThirdPayoutWindow")

    function deposit(payee, payer, token, amount) {
        return Deposit(payee, payer, token, amount)
    }

    function pay (payer, payee, token, amount, continuation) {
        return Pay(payer, payee, token, amount, continuation)
    }

    return When(
        [Case(deposit(bank, funder, ada, funderDeposit),
            When(
                [],
                firstPayoutWindow,
                pay(bank, Account(payee), ada, DivValue(funderDeposit, Constant(3)),
                When(
                    [],
                    secondPayoutWindow,
                    pay(bank, Account(payee), ada, DivValue(funderDeposit, Constant(3)),
                    When(
                        [],
                        thirdPayoutWindow,
                        pay(bank, Account(payee), ada, AvailableMoney(ada, bank),
                        Close
                    )
                ))
            )
        )))], funderDepositDeadline, Close);


})