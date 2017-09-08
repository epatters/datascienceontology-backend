/* Work around bad interaction between NPM link and webpack.

Currently we are using `yarn link` to symlink this package into the frontend
package. This file shouldn't exist but without it webpack fails to resolve
the "data-science-ontology" module. See output from `webpack --verbose`.

Possible related issues:
  https://github.com/webpack/webpack/issues/811
  https://github.com/webpack/webpack/issues/1866
*/
export * from "./src/index";
