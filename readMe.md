https://codeburst.io/monorepos-by-example-part-1-3a883b49047e
#Start
lerna bootstrap --hoist

#Add bannana project to fruit
lerna add bannana --scope=fruit
lerna add poodna-type --scope=poodna-backend
lerna add poodna-design-system --scope=poodna-frontend
lerna add tailwindcss --scope=poodna-design-system
lerna add twin.macro --scope=poodna-design-system
lerna add autoprefixer --scope=poodna-design-system
lerna add babel-plugin-macros --scope=poodna-design-system
lerna add postcss-cli --scope=poodna-design-system
lerna add @types/react --scope=poodna-design-system

#Init new
lerna init
