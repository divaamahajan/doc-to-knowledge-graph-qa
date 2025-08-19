import logging

def setup_logger(name, level=logging.INFO):
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # Create console handler and set level
    ch = logging.StreamHandler()
    ch.setLevel(level)

    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s %(levelname)s [pid=%(process)d, tid=%(thread)d, mn=%(module)s, fn=%(funcName)s] %(message)s'
    )

    # Add formatter to ch
    ch.setFormatter(formatter)

    # Add ch to logger
    logger.addHandler(ch)

    return logger

# Example usage:
# from logger import setup_logger
# logger = setup_logger(__name__)