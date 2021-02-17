# chodo

## MVP 1

A to-do list app.

### Features

- create a profile
- create a project
- create a project task
- complete a project task

## MVP 2

A todo-list app _that rewards upon completing tasks_.

### Features

todo

## Networks

There are several networks that can be used:

- localnet: http://localhost:8899
- devnet: http://devnet.solana.com
- testnet: http://testnet.solana.com:8899
- mainnet: https://api.mainnet-beta.solana.com

## Problems

- if npm run start gives error => check that the program has been build and deployed with npm run build and npm run deploy
- if solana net is down i need to create again the payer account and add the new vaues to soprox config, then do as above

The needed steps to do the whole stuff is:

1- localnet:update
2- localnet:up => now the docker image has started with a running solana devnet
3- npm run account => create a usable account on the network (save the data in soprox.config)
4- npm run build => build solana rust program
5- npm run deploy => deploy the program on the network and create needed json data for the client based on the deployed data (store)

Now i can do my things and run client interactive stuff like npm run start

When finished => npm run localnet:down

## Account

Actually our account didn’t exist until just now, the action of sending funds to an address is what calls the account into existence.

In Solana, accounts are charged a very tiny amount of ‘rent’ every epoch, when the balance of an account goes to zero, it returns to the void...
There is an exception to this rule, above a certain balance, an account is rent exempt and lives forever.

## Folder structure

todo

## Notes

Less config file taken from
https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less

Vapor is the name of the theme
