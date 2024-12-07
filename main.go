package main

import (
	"bytes"
	"embed"
	"fmt"
	"text/template"

	webview "github.com/webview/webview_go"
)

//go:embed templates
var content embed.FS

type IncrementResult struct {
	Count uint `json:"count"`
}

var baseTemplate *template.Template

// Função para inicializar o template base com todos os templates necessários
func initBaseTemplate() {
	baseTemplate = template.New("index")

	// Carregar todos os templates necessários no template base
	baseTemplate = template.Must(baseTemplate.ParseFS(content,
		"templates/index.html",
		"templates/header.html",
		"templates/footer.html",
		"templates/pages/initial.html", // Template inicial
	))
}

// Função para trocar de template
func setTemplate(w webview.WebView, templateName string) {
	// Cria um buffer para armazenar o HTML gerado
	var buf bytes.Buffer

	_, err := baseTemplate.ParseFS(content, templateName)
	if err != nil {
		panic(err)
	}
	// Executa o template desejado
	err = baseTemplate.ExecuteTemplate(&buf, "index", nil)
	if err != nil {
		panic(err)
	}

	// Atualiza a WebView com o conteúdo renderizado
	//fmt.Println(buf.String())
	w.SetHtml(buf.String())
}

func main() {
	InjectAssets()
	var count uint = 0
	w := webview.New(false)
	defer w.Destroy()
	w.SetTitle("Bind Example")
	w.SetSize(480, 320, webview.HintNone)

	// A binding that increments a value and immediately returns the new value.
	w.Bind("increment", func() IncrementResult {
		count++
		return IncrementResult{Count: count}
	})

	w.Bind("setTemplate", func() {
		fmt.Println("setTemplate click")
		// Carregar o template inicial
		setTemplate(w, "templates/pages/list.html")
	})

	w.Bind("setTemplate1", func() {
		fmt.Println("setTemplate click")
		// Carregar o template inicial
		setTemplate(w, "templates/pages/initial.html")
	})

	// Inicializar o template base com todos os templates necessários
	initBaseTemplate()
	setTemplate(w, "templates/pages/initial.html")

	//w.Navigate("file:///home/cezar.britez/Development/Go/my-webview/tabler/layout-navbar-sticky.html")
	w.Run()
}
