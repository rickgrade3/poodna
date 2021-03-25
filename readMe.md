https://codeburst.io/monorepos-by-example-part-1-3a883b49047e
#Start
lerna bootstrap --hoist

#Add bannana project to fruit
lerna add bannana --scope=fruit
lerna add poodna-type --scope=poodna-backend
lerna add poodna-design-system --scope=poodna-frontend
#Init new
lerna init
