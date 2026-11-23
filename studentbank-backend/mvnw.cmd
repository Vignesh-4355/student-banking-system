@echo off
@REM StudentBank Maven Execution Script
set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.10"
if exist "C:\Program Files\apache-maven-3.9.16\bin\mvn.cmd" (
    "C:\Program Files\apache-maven-3.9.16\bin\mvn.cmd" %*
) else (
    mvn %*
)
