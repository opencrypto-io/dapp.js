
# <pkg-id>ds-value</pkg-id>
**<pkg-title>DSValue</pkg-title>**

<pkg-description></pkg-description>

<pkg-docs></pkg-docs>

## Contracts mapping
<pkg-contracts>No mapping</pkg-contracts>

## API
<pkg-api>

### get (address, [type])

* **Params:** 
  * {string} address - The address of target contract

  * {string} type - Format of the results (Hex, String, NumberString..) 
* **Returns:**
  * {promise} Promise (resolves to value)

Get a value.


### set (address, [type])

* **Params:** 
  * {string} address - The address of target contract

  * {string} type - Format of the input (Hex, String, NumberString..) 
* **Returns:**
  * {promise} Promise (resolves to transaction promise)

Set a value.
</pkg-api>
