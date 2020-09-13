import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    let results = await this.find({ where: { type: 'income' } });
    const income = results.reduce((acumulator, currentValue) => {
      if (currentValue.type === 'income') {
        return acumulator + currentValue.value;
      }
      return acumulator;
    }, 0);

    results = await this.find({ where: { type: 'outcome' } });
    const outcome = results.reduce((acumulator, currentValue) => {
      if (currentValue.type === 'outcome') {
        return acumulator + currentValue.value;
      }
      return acumulator;
    }, 0);

    const total = income - outcome;

    const balance = { income, outcome, total };

    return balance;
  }
}

export default TransactionsRepository;
