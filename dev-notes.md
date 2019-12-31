Source: [https://objectcomputing.com/resources/publications/sett/july-2019-web-dev-simplified-with-svelte]
Svelte can bind a child component prop to a variable in the parent component. This allows child components to change values of parent component variables.

For example, here is a parent component:

```js
<script>
  import Child from './Child.svelte';
  let pValue = 1;
</script>
 
<div>pValue = {pValue}</div>
<Child bind:cValue={pValue} />
```

And here is the child component:

```js
<script>
  export let cValue = '';
  const double = () => (cValue *= 2);
</script>
 
<div>cValue = {cValue}</div>
<button on:click={double}>Double</button>
```

When the button in the Child component is pressed, cValue is doubled, and that becomes the new value of pValue because it is bound to cValue.

