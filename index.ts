import { v4 as uuidv4 } from 'uuid';

console.log("Hello!");

type Either<L, R> = Left<L> | Right<R>;

class Left<L> {
  value: L;

  constructor(value: L) {
    this.value = value;
  }

  isLeft(): this is Left<L> {
    return true;
  }

  isRight(): this is Right<L> {
    return false;
  }
}

class Right<R> {
  value: R;
  constructor(value: R) {
    this.value = value;
  }

  isLeft(): this is Left<R> {
    return false;
  }

  isRight(): this is Right<R> {
    return true;
  }
}

function left<L, R>(value: any): Either<L, R> {
  return new Left<L>(value);
}

function right<L, R>(value: any): Either<L, R> {
  return new Right<R>(value);
}

export type Input = {
  from: { funds: number };
  to: { funds: number };
  amount: any;
}

export type Output = Either<Error, {
  id: number;
}>;

interface TransferFundsParamsError {
  error: TransferFundsErrorEnum;
  message: string;
  toJSON: () => { error: string; message: string, name: string };
}

class TransferFundsError extends Error  implements TransferFundsParamsError {
  error: TransferFundsErrorEnum;
  name: string;

  constructor(message: string, error: TransferFundsErrorEnum) {
    super(message);
    this.error = error;
    this.name = "TransferFundsError";
    this.message = this.message;
  }

  toJSON() {
    return {
      error: this.error,
      message: this.message,
      name: this.name,
    };
  }
}

enum TransferFundsErrorEnum {
  NoFundsFromAccount = "NoFundsFromAccount",
  NoFundsToAccount = "NoFundsToAccount",
  InsufficientFunds = "InsufficientFunds",
}

class TransferFundsUseCase {
  constructor() {}

  execute(input: Input): Output {
    if (!input.from.funds) {
      return left(new TransferFundsError("No funds in the from account", TransferFundsErrorEnum.NoFundsFromAccount));
    }

    if (!input.to.funds) {
      return left(new TransferFundsError("No funds in the to account", TransferFundsErrorEnum.NoFundsToAccount));
    }

    if (input.from.funds < input.amount) {
      return left(new TransferFundsError("The transfer cannot be completed due to insufficient funds in the account", TransferFundsErrorEnum.InsufficientFunds));
    }

    return right({
      id: uuidv4(),
    })
  } 
}

const input = {
  from: { funds: 100 },
  to: { funds: 100 },
  amount: 110,
}

const transferFundsUseCase = new TransferFundsUseCase().execute(input);

// Do threadtment
if (transferFundsUseCase.isLeft()) {
  // Do something with the error
  const message = transferFundsUseCase.value.toJSON();
  console.log({message});
  return;
}

// Finish
console.log('Opa!')
