module.exports.checkUpdate = function (req, res) {
    let ver = req.query.version
    console.log(ver)
    const latest_ver = 1.6
    if (ver >= latest_ver) {
        res.status(200).send({
            status: true,
            message: "Using latest version"
        })
    } else {
        res.status(200).send({
            status: false,
            message: `A new version of CORONA Tracker is available. Please update to version ${latest_ver} now`,
            url: 'https://i.diawi.com/RUBa2r'
        })
    }
}