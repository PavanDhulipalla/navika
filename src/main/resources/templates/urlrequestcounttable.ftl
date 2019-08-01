<!doctype html>
<html>
   <head>
   </head>
   <body>
      <div class="container">
      <h2>Logs Table</h2>
      <table border=1>
         <tr>
            <th>Host Name:</th>
            <th>Hit Count:</th>
         </tr>
         <#list urlRequestCountMap?keys as key>
         <#if key??>
         <tr>
            <td>
               ${key}
            </td>
            <td>
               ${urlRequestCountMap[key]}
            </td>
         </tr>
         </#if>
         </#list>
      </table>
      
      <h2>URL Status Table</h2>
      <table border=1>
         <tr>
            <th>URL Name:</th>
            <th>Status:</th>
         </tr>
         <#list urlStatusMap?keys as key>
         <#if key??>
         <tr>
            <td>
               ${key}
            </td>
            <td>
               ${urlStatusMap[key]}
            </td>
         </tr>
         </#if>
         </#list>
      </table>
   </body>
</html>