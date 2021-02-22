# DFYN Interface
An open source interface for DFYN network - gasless exchange for tokens on Matic chain

- Website: [dfyn.network](https://www.dfyn.network)
- Exchange: [exchange.dfyn.network](https://exchange.dfyn.network)
- Analytics: [info.dfyn.network](https://info.dfyn.network)

## Accessing the DFYN Interface

To access the Dfyn Interface visit [exchange.dfyn.network](https://exchange.dfyn.network).

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 
