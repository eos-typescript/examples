const owner = N("owneraccount");

@Database
const db = new Database<Account>(N("accounts"));

@Action
function transfer(from: name, to: name, quantity: u64): void{
    require_auth(from);
    fromAccount: Account = db.get(from);
    eosio_assert(fromAccount.balance >= quantity, "overdrawn balance");
    
    fromAccount.balance -= quantity;
    addBalance(to, quantity);
}

@Action
function issue(to: name, quantity: u64): void{
    require_auth(owner);
    addBalance(to, quantity);   
}

function addBalance(to: name, quantity: u64): void{
    if(db.contains(to)){
        toAccount: Account = db.get(to);
        toAccount.balance += quantity;
        db.update(toAccount);
    } else {
        toAccount: Account = {"owner": to, "balance": quantity};
        db.insert(toAccount);
    }
}

interface Account {
    @PrimaryKey
    owner: name;
    balance: u64;
}

//TODO: Overflow detection
