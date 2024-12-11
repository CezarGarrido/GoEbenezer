package main

import (
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"log"
	"path"
	"runtime"
	"strings"
	"time"

	webview "github.com/webview/webview_go"
)

var w webview.WebView

func main() {
	debug := true
	w = webview.New(debug)
	defer w.Destroy()
	w.SetTitle("Enenezer")
	w.SetSize(800, 600, webview.HintNone)
	// Load the start page, index.html
	w.Navigate("file://" + pathToStartPage())

	// Expose the Go function printSomething as "ps"
	// in our WebView window. A JavaScript call to "ps"
	// will invoke the Go function printSomething.
	w.Bind("ps", printSomething)
	w.Bind("routeTo", routeTo)

	w.Bind("loadPdf", func() string {
		pdfPath := "report.pdf" // Caminho para o PDF
		data, err := ioutil.ReadFile(pdfPath)
		if err != nil {
			log.Printf("Erro ao carregar o PDF: %v", err)
			return ""
		}

		log.Printf("Arquivo carregado com sucesso, tamanho: %d bytes", len(data))
		return base64.StdEncoding.EncodeToString(data)
	})

	w.Bind("getWorker", func() string {
		workerCode, err := ioutil.ReadFile("./app/public/pdf.worker.min.mjs")
		if err != nil {

			log.Printf("Erro ao carregar o worker: %v", err)
			return ""
		}

		return string(workerCode)
	})

	// Run the app.
	w.Run()
}

// printSomething prints the name from the JavaScript form
// to STDOUT and back to the WebView HTML page.
func printSomething(name string) {
	now := time.Now().Format(time.Stamp)
	fmt.Println(textMessage(name, now))
	w.Eval(fmt.Sprintf("setDivContent('output', '%s')", htmlMessage(name, now)))
}

func routeTo(name string) {
	now := time.Now().Format(time.Stamp)
	fmt.Println(textMessage(name, now))
	w.Eval(fmt.Sprintf("setRouterView('%s', '%s')", name, htmlMessage(name, now)))
}

// Returns a plain text message to display in the console.
func textMessage(name, time string) string {
	return fmt.Sprintf(">>> [%s] Hello, %s.", time, name)
}

// Returns an HTML message to display in the webview.
func htmlMessage(name, time string) string {
	escapedName := strings.ReplaceAll(name, "'", "&#39;")
	return fmt.Sprintf(`Hello, <b>%s</b>. The current time is <span class="blue">%s</span>. Check your console window for a message.`, escapedName, time)
}

// pathToStartPage returns the absolute path the index.html page
// we want to show when the app starts up. This works when we're
// running the app through 'go run main.go' because runtime.Caller()
// returns the path of this source file, not the path of the temp
// file created by 'go run'.
func pathToStartPage() string {
	_, currentFile, _, _ := runtime.Caller(0)
	dir := path.Dir(currentFile)
	return path.Join(dir, "/app/public/index.html")
}

func getWorker() {
	workerCode, err := ioutil.ReadFile("./app/public/pdf.worker.min.mjs")
	if err != nil {
		log.Fatalf("Erro ao ler o arquivo do worker: %v", err)
	}

	// Injetar o código do worker
	script := fmt.Sprintf(`
		PDFJS.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob(['%s'], { type: 'application/javascript' }));
	`, workerCode)

	w.Eval(script)

}
