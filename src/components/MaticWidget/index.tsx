import React from 'react'
import styled from 'styled-components'

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
  color: #FFFFFF;
  font-size: 16px;
  margin-left: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
`
export default class MaticWidget extends React.Component {
  componentDidMount() {
    const script = document.createElement("script");
    script.src = "https://wallet.matic.network/embeds/widget-button.js";
    script.async = true;
    script.setAttribute('data-script-name', 'matic-embeds')
    document.body.appendChild(script);
    this.redirectToWalletMatic = this.redirectToWalletMatic.bind(this);
  }
  redirectToWalletMatic() {
    window.open('https://wallet.matic.network', '_blank')
  }
  render() {
    return (
      <StyledMenuButton className="matic-widget-button" data-default-page="home" data-wapp-id="WJMwkFlrLdXPtGerzhyP">
        Matic Bridge
      </StyledMenuButton>
    )
  }
}
