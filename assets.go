package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"strings"

	"github.com/evanw/esbuild/pkg/api"
)

func InjectAssets() {
	// Passo 1: Configurar a compilação com esbuild
	JsResult := api.Build(api.BuildOptions{
		EntryPoints: []string{"templates/assets/**/*.js"}, // Caminho para o seu arquivo JavaScript
		Bundle:      true,                                 // Habilitar o bundling
		Write:       false,                                // Não escrever o bundle em disco, queremos manipulá-lo
		Outdir:      "out",
	})

	cssResult := api.Build(api.BuildOptions{
		EntryPoints: []string{"templates/assets/**/*.css"}, // Caminho para o seu arquivo JavaScript
		Bundle:      true,                                  // Habilitar o bundling
		Write:       false,                                 // Não escrever o bundle em disco, queremos manipulá-lo
		Outdir:      "outcss",
	})

	// Verifica se há erros na compilação
	if len(JsResult.Errors) > 0 {
		for _, e := range JsResult.Errors {
			fmt.Println("Erro:", e.Text)
		}
		return
	}

	// Verifica se há erros na compilação
	if len(cssResult.Errors) > 0 {
		for _, e := range cssResult.Errors {
			fmt.Println("Erro:", e.Text)
		}
		return
	}

	var scripts []string
	for _, out := range JsResult.OutputFiles {
		// Adicionando o conteúdo de cada script compilado
		scripts = append(scripts, fmt.Sprintf("<script>%s</script>", string(out.Contents)))
	}

	var styles []string
	for _, out := range cssResult.OutputFiles {
		// Adicionando o conteúdo de cada script compilado
		styles = append(styles, fmt.Sprintf("<style>%s</style>", string(out.Contents)))
	}

	// Concatenando todos os scripts em uma única string
	scriptsContent := strings.Join(scripts, "\n")
	stylesContent := strings.Join(styles, "\n")

	indexContent, _ := ioutil.ReadFile("templates/index.html")

	indexHTML := string(indexContent)
	htmlContent := strings.Replace(indexHTML, "{{scripts}}", scriptsContent, 1)
	htmlContent = strings.Replace(htmlContent, "{{styles}}", stylesContent, 1)

	_ = os.WriteFile("templates/index.html", []byte(htmlContent), 0644)
}
