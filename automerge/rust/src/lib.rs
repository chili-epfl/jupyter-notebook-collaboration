// stdlib
use std::fs::File;

// Python Wrappers
use pyo3::prelude::*;



// Logging
use log::{ LevelFilter};
use simplelog::*;

mod ambackend;


// The main python module - jupyter_rtc_automerge
#[pymodule]
fn jupyter_rtc_automerge(py: Python, module: &PyModule) -> PyResult<()> {
    CombinedLogger::init(vec![
        TermLogger::new(LevelFilter::Warn, Config::default(), TerminalMode::Mixed),
        WriteLogger::new(
            LevelFilter::Info,
            Config::default(),
            File::create("./jupyter_rtc_automerge.log").unwrap(),
        ),
    ])
    .unwrap();

    let submod = PyModule::new(py, "automerge")?;
    ambackend::init_submodule(submod)?;
    module.add_submodule(submod)?;
    Ok(())
}