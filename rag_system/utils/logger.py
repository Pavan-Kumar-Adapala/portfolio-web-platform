import logging
import os


class Logger:
    """
    Utility class for shared logging configuration across rag_system and rag_system_api modules.
    Call configure_logging() once at startup (app.py or main.py).
    Use get_logger(__name__) in every module.
    """

    @staticmethod
    def get_logger(name: str) -> logging.Logger:
        """
        Returns a logger with the given name.
        Uses Python's built-in singleton — same name always
        returns the same logger instance across all modules.
        """
        return logging.getLogger(name)

    # ---------------- Static method to configure logging at application startup ----------------
    @staticmethod
    def configure_logging(log_file: str = "./logs/rag_system.log") -> None:
        """
        Call this ONCE at application startup.
        All modules using get_logger() inherit this config automatically.
        """
        os.makedirs(os.path.dirname(log_file), exist_ok=True)

        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
            filemode="a",
            filename=log_file,
            # force=True  # Ensure this config is applied even if logging was previously configured
        )

        # Also output to terminal
        # console_handler = logging.StreamHandler()
        # console_handler.setLevel(logging.INFO)
        # console_handler.setFormatter(logging.Formatter(
        #     "%(asctime)s - %(levelname)s - %(name)s - %(message)s"
        # ))
        # logging.getLogger().addHandler(console_handler)