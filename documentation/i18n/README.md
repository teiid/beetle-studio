# Internationalization in Beetle

`Beetle` uses the built-in i8n functionality provided by **Angular**. It is well-documented here: https://angular.io/guide/i18n, but we document the steps here as well for purposes of brevity and clarity as i18n applies to `Beetle`.

The steps to i8n are as follows:

1.  Add your attribute. Adding the **`i18n`** you would like made available for translation.

For example:

`<h1 i18n="@@id">Hello text</h1>`

`<h1 i18n="meaning|description@@id">Hello text</h1>`

`<h1 i18n="meaning@@id">Hello text</h1>`

`<h1 i18n="Hello Name|Describe source of {name}@@formName.helloName">Hello {name}</h1>`

Where **meaning** is the name of the text field to translate, **description** is short description of the text and the **id** is a unique value we specify to easily identify the text in the i18n file and in code.

If the **id** is omitted, one will be generated for you, but it is long, complex and not easily identifiable as to it's association. The format for the id is file name of the html where the translation lives, a dot(.), filed by the meaning value CamelCase and without dashes or spaces. For Example: If the **id** is omitted, one will be generated for you, but it is long, complex and not easily identifiable as to it's association. The format for the id is file name of the html where the translation lives, a dot, filed by the meaning value CamelCase and without dashes. For Example:
`i18n="Connection Properties|Properties for a connection@@addConnectionForm.connectionProperties"`

There are other acceptable formats such as for plural values and image titles. Please see the Angular documentation for these additional formats.

2. Run the messages generator. Open a terminal window at /src/main/ngapp/ of the application project and enter the ng-xi18n command: `./node_modules/.bin/ng-xi18n --i18nFormat=xlf  --outFile=messages.xlf` which will generate `messages.xlf` in the root folder of project. This file will contain all the translatable fields. You will need to compare this `messages.xlf` to the latest in `master`. Add any new translations to each messages.{language}.xlf file in {root}/src/locale. For example, messages.es.xlf for Spanish translations. If this is the first time a translation file is being generated for a language, just copy the generates message file over to the src/locale folder, rename the new file messages.{languagecode}.xlf.

You will then need to add the correct translation:

<trans-unit id="introductionHeader" datatype="html">
  <source>Hello i18n!</source>
  <target>¡Hola i18n!</target>
  <note priority="1" from="description">An introduction header for this sample</note>
  <note priority="1" from="meaning">User welcome</note>
</trans-unit>

3. Generate the war for each language. Run `ng serve --aot --locale es --i18n-format xlf --i18n-file ./locale/messages.{languageCode}.xlf`
Running the maven build will likely handle this step as well.

