# jenca-runtime

The interface to the jenca Kubernetes cluster.  The runtime turns jenca `projects` into running Kubernetes resources (rcs, services etc)

## projects

A project describes what resources to run as a collection - this could mean a single container or many containers communicating using services.

There will be various project formats - each of which is compiled into native Kubernetes manifests.

Any project format **must** be parsable into a data-structure that could be represented as JSON.  The JSON type data-structure is what we will present to the jenca-runtime.

Here is the most basic JSON format for a project:

```js
{
  format:'jenca',
  version:1,
  pods:[{
    ...here is standard k8s pod manifest
  }],
  services:[{
    ...here is standard k8s service manifest
  }]
}
```