![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-investec-private banking

This is an n8n community node. It lets you interact with your Investec Private banking account via their [Programmable Banking API](https://developer.investec.com/za/api-products/documentation/SA_PB_Account_Information)

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Learn more about Investec Programmable banking

https://developer.investec.com/za/home

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Compatibility

Developed and tested using n8n version 1.111.0

## Usage

TODO

## TODO

To make your custom node available to the community, you must create it as an npm package, and [submit it to the npm registry](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry).

If you would like your node to be available on n8n cloud you can also [submit your node for verification](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/).

## Development 

You need the following installed on your development machine:

* [git](https://git-scm.com/downloads)
* Node.js and npm. Minimum version Node 20. You can find instructions on how to install both using nvm (Node Version Manager) for Linux, Mac, and WSL [here](https://github.com/nvm-sh/nvm). For Windows users, refer to Microsoft's guide to [Install NodeJS on Windows](https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows).
* Install n8n with:
  ```
  npm install n8n -g
  ```
* Recommended: follow n8n's guide to [set up your development environment](https://docs.n8n.io/integrations/creating-nodes/build/node-development-environment/).

## Running locally

Install all the requirement for local development.

To build run 
```bash
npm run build
npm link
```

Then to run locally
```bash
cd ~/.n8n/custom
npm link n8n-nodes-investec-private-banking
n8n start
```
y

## Contributing

TODO - Templates

- 🐛 **Report Bugs**: Open an issue with detailed bug reports
- 💡 **Feature Requests**: Suggest new features or improvements
- 📝 **Documentation**: Help improve our docs and code comments
- 🔧 **Code Contributions**: Submit pull requests for bug fixes or features

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=tamtom/StepsShare-oss&type=Date)](https://star-history.com/#yourusername/StepsShare-oss&Date)

---

<div align="center">
  <p>If you find this project helpful, please give it a ⭐️!</p>
</div>