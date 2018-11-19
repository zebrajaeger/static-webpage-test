# Webpage

This is a testproject to evaluate a gulp driven static-website-project

## Maven usage
### clean
Clean only target directory

    mvn clean 
  
Clean also node, node_modules and dist directory

    mvn clean -Pclean-frontend
    
### build
Build the project

    mvn compile
or

    mvn package
or

    mvn install
    
To do this without the frontend step

    mvn compile/package/install -Dskip-frontend
disables the 'build-frontend' profile where the frontend stuff is installed and build        