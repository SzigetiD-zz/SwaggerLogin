
## Installation

1. Download or clone this repository.
2. Go to `Settings > Extensions` in Chrome.
3. Make sure Developer mode is enabled.
4. Click `Load unpacked extension...`.
5. Select the directory where you saved this project.

## Getting Started

Clicking this extension's icon brings up a popup where you can enter your login endpoint and json data.

After saving your credentials you can click the 'Log In' button which has now been added to swagger ui pages to have the extension automatically set your auth token.


## Important Note
This currently only works if the endpoint response is in the form of
```json
{
    "token": "ey......"
}
```
