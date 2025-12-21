export default (req: any, res: any) => {
  res.status(200).json({
    message: 'Hello World!',
    path: req.url,
    method: req.method,
  })
}

