"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, CheckCircle, AlertCircle, Plus } from "lucide-react"

type ScrapeStatus = "not_run" | "running" | "finished"

interface UrlData {
  id: number
  url: string
}

interface ScrapedData {
  content: string
  status: ScrapeStatus
}

// Mock function for web scraping
const mockScrape = async (url: string) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return `Scraped content from ${url}:\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisi vel consectetur interdum, nisl nunc egestas nunc, vitae tincidunt nisl nunc euismod nunc.`
}

export function WebScrapingToolComponent() {
  const [urls, setUrls] = useState<UrlData[]>([
    { id: 1, url: "https://example.com" },
    { id: 2, url: "https://example.org" },
    { id: 3, url: "https://example.net" },
  ])
  const [newUrl, setNewUrl] = useState("")
  const [scrapedData, setScrapedData] = useState<{ [key: number]: ScrapedData }>({})
  const [selectedUrlId, setSelectedUrlId] = useState<number | null>(null)

  const handleStartScraping = async (id: number, url: string) => {
    setScrapedData(prev => ({ ...prev, [id]: { content: "", status: "running" } }))
    const scrapedContent = await mockScrape(url)
    setScrapedData(prev => ({ ...prev, [id]: { content: scrapedContent, status: "finished" } }))
    setSelectedUrlId(id)
  }

  const handleAddUrl = () => {
    if (newUrl.trim() !== "") {
      const newId = Math.max(...urls.map(u => u.id), 0) + 1
      setUrls(prev => [...prev, { id: newId, url: newUrl.trim() }])
      setNewUrl("")
    }
  }

  const getStatusIcon = (status: ScrapeStatus) => {
    switch (status) {
      case "not_run":
        return <AlertCircle className="h-4 w-4 text-gray-400" />
      case "running":
        return <Play className="h-4 w-4 text-blue-500 animate-pulse" />
      case "finished":
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add New URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  type="url"
                  placeholder="Enter a new URL"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
                <Button onClick={handleAddUrl}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>URLs to Scrape</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {urls.map((url) => {
                    const status = scrapedData[url.id]?.status || "not_run"
                    return (
                      <TableRow
                        key={url.id}
                        className="cursor-pointer transition-shadow hover:shadow-md"
                        onClick={() => setSelectedUrlId(url.id)}
                      >
                        <TableCell>{url.id}</TableCell>
                        <TableCell>{url.url}</TableCell>
                        <TableCell>{getStatusIcon(status)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleStartScraping(url.id, url.url)
                            }}
                            disabled={status === "running"}
                          >
                            {status === "running" ? (
                              "Scraping..."
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Scraped Data</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUrlId && scrapedData[selectedUrlId] ? (
              <div>
                <p className="font-semibold mb-2">
                  URL: {urls.find(u => u.id === selectedUrlId)?.url}
                </p>
                <p className="font-semibold mb-2">
                  Status: {scrapedData[selectedUrlId].status}
                </p>
                <pre className="whitespace-pre-wrap break-words">
                  {scrapedData[selectedUrlId].content || "Scraping in progress..."}
                </pre>
              </div>
            ) : (
              <p>Select a URL and click the play button to start scraping</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}