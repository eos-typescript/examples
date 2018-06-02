const owner = N("owneraccount");

@database
const db = new Database<Account>(N("accounts"));

@action
function transfer(from: name, to: name, quantity: u64): void{
    require_auth(from);
    let fromAccount: Account = db.get(from);
    eosio_assert(fromAccount.balance >= quantity, "overdrawn balance");
    
    fromAccount.balance -= quantity;
    addBalance(to, quantity);
}

@action
function issue(to: name, quantity: u64): void{
    require_auth(owner);
    addBalance(to, quantity);   
}

function addBalance(to: name, quantity: u64): void{
    if(db.contains(to)){
        let toAccount: Account = db.get(to);
        toAccount.balance += quantity;
        db.update(toAccount);
    } else {
        let toAccount = new Account(to, quantity);
        db.insert(toAccount);
    }
}

class Account {
    @primary
    owner: name;
    balance: u64;
    
    constructor(owner: name, balance: u64) {
        this.owner = owner;
        this.balance = balance;
    }
}

//TODO: Overflow detection
