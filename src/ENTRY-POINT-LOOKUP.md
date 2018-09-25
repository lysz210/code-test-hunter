`function* lookup(directory: string)`
===

This function check for files within the given directory.  
It's a Generator function because it's the best choice to
handle well huge directory.
The directory is done as breadth first.

## directory resolution
first of all the derectory si normalized with `path.resolve` to resolve symbles like .. ~