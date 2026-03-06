# Release notes for the React/Redux Project Starter

## Version 2.0.1

April 20th, 2017

- Add sourcemaps to webpack config
- Faster webpack build using happy pack
- Containers use more verbose and consistent syntax

## Version 2.0.0

February 6th, 2017

- Change development port to 3000, configurable via env variable
- Add support for apps hosted not on root
- Rename API env variable to API_HOST
- Add isomorphic 404 handling
- Add meta data wrapper for page components
- Fix dev server redirection bug
- Replace `classnames` with `classnames`
- Allow toggling of redux dev tools by env variable
- Add `system` state assets
- Demonstrate better redux practices
- Modify the Webpack config to exclude '.jsx' file extensions
- Auto-detect storybook stories
- Include fetch polyfill by default
- Add testing npm script and tests
- Add `react-router-redux` to fix time travel
- Add actions to programmatically change URL
- Add state management for page meta
- Remove HoC pattern from container; add meta support
- Fix HMR when `@import`ed CSS files change
- Extract main view components into view folder
- Update dependencies
- Update eslint settings to Facebook's recommended
- Add Facebook `.editorconfig`
- Update babel to use `latest` prefix
- Rename `lib` folder to hocs (higher order components)
- Remove useless demo route
- Add NPM module to detect if in browser
- Refine env variable sharing process
- Add html-to-jsx utility function
- Move eslint config to `.eslintrc.js`
- Qualify loader names for webpack
- Remove `.js` from imports
- Make the main landing page "pop" 😎, and easy to remove
- Clean up bundled HoCs
- Fix invalid mock nav data
- Other general code cleanup

Note: npm 3 or higher is required
